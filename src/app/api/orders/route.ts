import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";
import { createOrderSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/order-number";

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { addressId, address, guestContact, shipping } = parsed.data;

  const cart = await getOrCreateCart();
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  let shippingAddress: {
    shippingRecipientName: string;
    shippingPhone: string;
    shippingCep: string;
    shippingStreet: string;
    shippingNumber: string;
    shippingComplement: string | null;
    shippingNeighborhood: string;
    shippingCity: string;
    shippingState: string;
  };

  if (session?.user && addressId) {
    const saved = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });
    if (!saved) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 });
    }
    shippingAddress = {
      shippingRecipientName: saved.recipientName,
      shippingPhone: saved.phone,
      shippingCep: saved.cep,
      shippingStreet: saved.street,
      shippingNumber: saved.number,
      shippingComplement: saved.complement,
      shippingNeighborhood: saved.neighborhood,
      shippingCity: saved.city,
      shippingState: saved.state,
    };
  } else if (address) {
    shippingAddress = {
      shippingRecipientName: address.recipientName,
      shippingPhone: address.phone,
      shippingCep: address.cep,
      shippingStreet: address.street,
      shippingNumber: address.number,
      shippingComplement: address.complement ?? null,
      shippingNeighborhood: address.neighborhood,
      shippingCity: address.city,
      shippingState: address.state,
    };
  } else {
    return NextResponse.json({ error: "Endereço de entrega é obrigatório" }, { status: 400 });
  }

  if (!session?.user && !guestContact) {
    return NextResponse.json({ error: "Dados de contato são obrigatórios" }, { status: 400 });
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );
  const total = subtotal + shipping.price;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new Error(`STOCK_UNAVAILABLE:${item.variant.product.name} (${item.variant.size})`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id,
          guestName: guestContact?.name,
          guestEmail: guestContact?.email,
          guestPhone: guestContact?.phone,
          ...shippingAddress,
          subtotal,
          shippingCost: shipping.price,
          total,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              productName: item.variant.product.name,
              size: item.variant.size,
              sku: item.variant.sku,
              unitPrice: item.variant.price,
              quantity: item.quantity,
            })),
          },
          shipment: {
            create: {
              carrierName: shipping.carrierName,
              serviceName: shipping.serviceName,
              cost: shipping.price,
              estimatedDays: shipping.estimatedDays,
            },
          },
          sigecloudSync: { create: {} },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("STOCK_UNAVAILABLE:")) {
      return NextResponse.json(
        { error: `Estoque insuficiente para ${error.message.split(":")[1]}` },
        { status: 409 }
      );
    }
    console.error("Erro ao criar pedido", error);
    return NextResponse.json({ error: "Não foi possível criar o pedido" }, { status: 500 });
  }
}
