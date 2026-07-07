import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

const updateItemSchema = z.object({
  quantity: z.number().int().min(1).max(20),
});

async function assertOwnedItem(itemId: string) {
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === itemId);
  return { cart, item };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const body = await request.json();
  const parsed = updateItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { item } = await assertOwnedItem(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  if (parsed.data.quantity > item.variant.stockQuantity) {
    return NextResponse.json(
      { error: `Apenas ${item.variant.stockQuantity} unidade(s) em estoque` },
      { status: 409 }
    );
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: parsed.data.quantity },
  });

  const cart = await getOrCreateCart();
  return NextResponse.json({ cart });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const { item } = await assertOwnedItem(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await getOrCreateCart();
  return NextResponse.json({ cart });
}
