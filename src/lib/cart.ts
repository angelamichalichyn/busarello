import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CART_COOKIE = "cart_session_id";

const cartInclude = {
  items: {
    include: { variant: { include: { product: true } } },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function getOrCreateCart() {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: cartInclude,
    });
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE)?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
    include: cartInclude,
  });
}

/**
 * Versão somente-leitura para uso em Server Components (páginas), que não
 * podem gravar cookies durante a renderização. Não cria carrinho/cookie —
 * isso só acontece em Route Handlers e Server Actions via getOrCreateCart().
 */
export async function getCart() {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId) {
    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) return null;

  return prisma.cart.findUnique({ where: { sessionId }, include: cartInclude });
}

export async function getCartItemCount() {
  const cart = await getCart();
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export async function mergeGuestCartIntoUserCart() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) await prisma.cart.delete({ where: { id: guestCart.id } });
    cookieStore.delete(CART_COOKIE);
    return;
  }

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  for (const item of guestCart.items) {
    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
      update: { quantity: { increment: item.quantity } },
      create: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
    });
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
  cookieStore.delete(CART_COOKIE);
}
