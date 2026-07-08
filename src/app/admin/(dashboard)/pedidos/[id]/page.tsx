import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { resyncOrderToSigecloud, updateShipmentStatus } from "@/lib/actions/admin-orders";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true, shipment: true, sigecloudSync: true, user: true },
  });

  if (!order) notFound();

  const resyncWithId = resyncOrderToSigecloud.bind(null, order.id);
  const updateShipmentWithId = updateShipmentStatus.bind(null, order.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">#{order.orderNumber}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {order.user?.name ?? order.guestName} ({order.user?.email ?? order.guestEmail})
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <section className="admin-card p-5">
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 mb-3">Itens</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-zinc-300">
              <span>
                {item.productName} ({item.size}) x{item.quantity} — SKU {item.sku}
              </span>
              <span>{formatCurrencyBRL(Number(item.unitPrice) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm flex justify-between border-t border-zinc-800 pt-3">
          <span className="text-white font-medium">Total</span>
          <span className="text-orange-400 font-medium">{formatCurrencyBRL(Number(order.total))}</span>
        </div>
      </section>

      <section className="admin-card p-5">
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 mb-3">Pagamento</h2>
        {order.payment ? (
          <div className="text-sm space-y-1 text-zinc-300">
            <p>Status: <StatusPill status={order.payment.status} type="payment" /></p>
            <p>Método: {order.payment.method ?? "—"}</p>
            <p>ID externo (Mercado Pago): {order.payment.externalId ?? "—"}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Nenhum pagamento registrado ainda.</p>
        )}
      </section>

      <section className="admin-card p-5">
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 mb-3">Envio</h2>
        {order.shipment && (
          <div className="text-sm space-y-3">
            <p className="text-zinc-300">
              {order.shipment.carrierName} — {order.shipment.serviceName} —{" "}
              {formatCurrencyBRL(Number(order.shipment.cost))}
            </p>
            <form action={updateShipmentWithId} className="flex items-center gap-2">
              <input
                name="trackingCode"
                placeholder="Código de rastreio"
                defaultValue={order.shipment.trackingCode ?? ""}
                className="admin-input py-1.5"
              />
              <select name="status" defaultValue={order.shipment.status} className="admin-input py-1.5">
                <option value="PENDENTE">Pendente</option>
                <option value="POSTADO">Postado</option>
                <option value="EM_TRANSITO">Em trânsito</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="EXTRAVIADO">Extraviado</option>
              </select>
              <button type="submit" className="admin-btn-outline py-1.5 shrink-0">
                Atualizar
              </button>
            </form>
          </div>
        )}
      </section>

      <section className="admin-card p-5">
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 mb-3">Sincronização com Sigecloud</h2>
        {order.sigecloudSync ? (
          <div className="text-sm space-y-2">
            <p className="text-zinc-300">
              Status: <StatusPill status={order.sigecloudSync.status} type="sync" />
            </p>
            <p className="text-zinc-300">Tentativas: {order.sigecloudSync.attempts}</p>
            {order.sigecloudSync.lastError && (
              <p className="text-red-400">Último erro: {order.sigecloudSync.lastError}</p>
            )}
            {order.sigecloudSync.sigecloudOrderId && (
              <p className="text-zinc-300">ID no Sigecloud: {order.sigecloudSync.sigecloudOrderId}</p>
            )}
            {order.sigecloudSync.status !== "ENVIADO" && (
              <form action={resyncWithId}>
                <button type="submit" className="admin-btn-outline py-1.5">
                  Reenviar para o Sigecloud
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Sem registro de sincronização.</p>
        )}
      </section>
    </div>
  );
}
