import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

const addItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = addItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { variantId, quantity } = parsed.data;

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.active) {
    return NextResponse.json({ error: "Produto indisponível" }, { status: 404 });
  }

  const cart = await getOrCreateCart();
  const existing = cart.items.find((i) => i.variantId === variantId);
  const desiredQuantity = (existing?.quantity ?? 0) + quantity;

  if (desiredQuantity > variant.stockQuantity) {
    return NextResponse.json(
      { error: `Apenas ${variant.stockQuantity} unidade(s) em estoque` },
      { status: 409 }
    );
  }

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: desiredQuantity },
    create: { cartId: cart.id, variantId, quantity },
  });

  const updatedCart = await getOrCreateCart();
  return NextResponse.json({ cart: updatedCart }, { status: 201 });
}
