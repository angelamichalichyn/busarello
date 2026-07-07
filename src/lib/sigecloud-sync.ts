import { prisma } from "@/lib/prisma";
import { exportOrderToSigecloud } from "@/lib/integrations/sigecloud";

export async function syncOrderToSigecloud(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });
  if (!order) return;

  try {
    const externalId = await exportOrderToSigecloud({
      orderNumber: order.orderNumber,
      customerName: order.user?.name ?? order.guestName ?? order.shippingRecipientName,
      customerEmail: order.user?.email ?? order.guestEmail,
      customerPhone: order.guestPhone ?? order.shippingPhone,
      shippingAddress: {
        cep: order.shippingCep,
        street: order.shippingStreet,
        number: order.shippingNumber,
        complement: order.shippingComplement,
        neighborhood: order.shippingNeighborhood,
        city: order.shippingCity,
        state: order.shippingState,
      },
      items: order.items.map((item) => ({
        sku: item.sku,
        description: `${item.productName} (${item.size})`,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
    });

    await prisma.sigecloudSync.update({
      where: { orderId },
      data: {
        status: "ENVIADO",
        sigecloudOrderId: externalId,
        lastError: null,
        attempts: { increment: 1 },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    await prisma.sigecloudSync.update({
      where: { orderId },
      data: {
        status: "ERRO",
        lastError: message,
        attempts: { increment: 1 },
      },
    });
  }
}
