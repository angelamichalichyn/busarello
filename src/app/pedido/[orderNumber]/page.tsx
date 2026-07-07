import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";

const statusLabels: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  PAGO: "Pagamento confirmado",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, shipment: true, payment: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Pedido {order.orderNumber}</h1>
      <p className="text-neutral-600 mb-8">
        Status: <span className="font-medium">{statusLabels[order.status] ?? order.status}</span>
      </p>

      <div className="space-y-2 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName} ({item.size}) x{item.quantity}
            </span>
            <span>{formatCurrencyBRL(Number(item.unitPrice) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-sm border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrencyBRL(Number(order.subtotal))}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete{order.shipment ? ` (${order.shipment.carrierName} - ${order.shipment.serviceName})` : ""}</span>
          <span>{formatCurrencyBRL(Number(order.shippingCost))}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t mt-2">
          <span>Total</span>
          <span>{formatCurrencyBRL(Number(order.total))}</span>
        </div>
      </div>

      <div className="mt-8 text-sm text-neutral-600">
        <p className="font-medium text-neutral-900 mb-1">Endereço de entrega</p>
        <p>
          {order.shippingRecipientName} — {order.shippingStreet}, {order.shippingNumber}
          {order.shippingComplement ? `, ${order.shippingComplement}` : ""}
        </p>
        <p>
          {order.shippingNeighborhood}, {order.shippingCity}/{order.shippingState} — {order.shippingCep}
        </p>
      </div>

      {order.status === "AGUARDANDO_PAGAMENTO" && (
        <Link
          href={`/checkout/pagamento/${order.orderNumber}`}
          className="mt-8 block w-full rounded bg-neutral-900 text-white py-3 text-center"
        >
          Concluir pagamento
        </Link>
      )}
    </div>
  );
}
