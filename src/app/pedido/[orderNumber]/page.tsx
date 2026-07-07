import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const statusLabels: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  PAGO: "Pagamento confirmado",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

const statusColors: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "bg-amber-50 text-amber-800",
  PAGO: "bg-green-50 text-green-700",
  ENVIADO: "bg-blue-50 text-blue-700",
  ENTREGUE: "bg-green-50 text-green-700",
  CANCELADO: "bg-red-50 text-red-700",
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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Minha conta", href: "/conta" }, { label: `#${order.orderNumber}` }]} />

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-pine">Pedido {order.orderNumber}</h1>
          <p className="text-sm text-ink/60 mt-1">
            Realizado em {order.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] ?? "bg-sand/30 text-ink"}`}>
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-serif text-xl text-pine mb-6">Itens do pedido</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between pb-4 border-b border-sand-light last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-ink">{item.productName}</p>
                    <p className="text-sm text-ink/60 mt-1">
                      Tamanho: {item.size} — Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-pine">
                    {formatCurrencyBRL(Number(item.unitPrice) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-serif text-lg text-pine mb-4">Endereço de entrega</h3>
            <div className="text-sm text-ink/70 space-y-1">
              <p>
                {order.shippingRecipientName} — {order.shippingStreet}, {order.shippingNumber}
                {order.shippingComplement ? `, ${order.shippingComplement}` : ""}
              </p>
              <p>{order.shippingNeighborhood}</p>
              <p>
                {order.shippingCity} - {order.shippingState}
              </p>
              <p>CEP: {order.shippingCep}</p>
            </div>
          </div>

          {order.shipment && (
            <div className="card p-6">
              <h3 className="font-serif text-lg text-pine mb-4">Envio</h3>
              <p className="text-sm text-ink/70">
                {order.shipment.carrierName} — {order.shipment.serviceName}
              </p>
              {order.shipment.trackingCode && (
                <p className="text-sm text-ink/50 mt-1">Rastreio: {order.shipment.trackingCode}</p>
              )}
            </div>
          )}

          <div className="card p-6 bg-pine text-cream">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-cream/70">Subtotal</span>
                <span>{formatCurrencyBRL(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/70">Frete</span>
                <span>{formatCurrencyBRL(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream/20">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">{formatCurrencyBRL(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {order.status === "AGUARDANDO_PAGAMENTO" && (
            <Link href={`/checkout/pagamento/${order.orderNumber}`} className="btn-primary w-full">
              Concluir pagamento
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
