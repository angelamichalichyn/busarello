import { prisma } from "@/lib/prisma";
import { syncOrderToSigecloud } from "@/lib/sigecloud-sync";

type MercadoPagoStatus = "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded";

function mapStatus(status: MercadoPagoStatus): "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REFUNDED" {
  switch (status) {
    case "approved":
      return "APPROVED";
    case "rejected":
      return "REJECTED";
    case "cancelled":
      return "CANCELLED";
    case "refunded":
      return "REFUNDED";
    default:
      return "PENDING";
  }
}

export async function applyMercadoPagoPaymentResult(input: {
  orderNumber: string;
  externalId: string;
  status: MercadoPagoStatus;
  method?: string;
  rawPayload: unknown;
}) {
  const order = await prisma.order.findUnique({ where: { orderNumber: input.orderNumber } });
  if (!order) return;

  const mappedStatus = mapStatus(input.status);

  await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      externalId: input.externalId,
      status: mappedStatus,
      method: input.method,
      rawPayload: input.rawPayload as never,
      paidAt: mappedStatus === "APPROVED" ? new Date() : undefined,
    },
    create: {
      orderId: order.id,
      externalId: input.externalId,
      status: mappedStatus,
      method: input.method,
      rawPayload: input.rawPayload as never,
      paidAt: mappedStatus === "APPROVED" ? new Date() : undefined,
    },
  });

  if (mappedStatus === "APPROVED" && order.status === "AGUARDANDO_PAGAMENTO") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "PAGO" } });
    await syncOrderToSigecloud(order.id);
  }

  // Rejeitado: mantemos o pedido em AGUARDANDO_PAGAMENTO (estoque reservado)
  // para o cliente poder tentar pagar novamente. Só liberamos o estoque
  // quando o pagamento é efetivamente cancelado.
  if (mappedStatus === "CANCELLED" && order.status === "AGUARDANDO_PAGAMENTO") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELADO" } });
    await restoreStockForOrder(order.id);
  }
}

async function restoreStockForOrder(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.productVariant.update({
      where: { id: item.variantId },
      data: { stockQuantity: { increment: item.quantity } },
    });
  }
}
