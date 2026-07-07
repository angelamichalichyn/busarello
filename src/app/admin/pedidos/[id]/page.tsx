import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { resyncOrderToSigecloud, updateShipmentStatus } from "@/lib/actions/admin-orders";

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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
        <p className="text-neutral-600">Status: {order.status}</p>
        <p className="text-neutral-600">
          Cliente: {order.user?.name ?? order.guestName} ({order.user?.email ?? order.guestEmail})
        </p>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">Itens</h2>
        <div className="space-y-1 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.productName} ({item.size}) x{item.quantity} — SKU {item.sku}
              </span>
              <span>{formatCurrencyBRL(Number(item.unitPrice) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm font-medium flex justify-between border-t pt-2">
          <span>Total</span>
          <span>{formatCurrencyBRL(Number(order.total))}</span>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Pagamento</h2>
        {order.payment ? (
          <div className="text-sm space-y-1">
            <p>Status: {order.payment.status}</p>
            <p>Método: {order.payment.method ?? "—"}</p>
            <p>ID externo (Mercado Pago): {order.payment.externalId ?? "—"}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Nenhum pagamento registrado ainda.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Envio</h2>
        {order.shipment && (
          <div className="text-sm space-y-2">
            <p>
              {order.shipment.carrierName} — {order.shipment.serviceName} —{" "}
              {formatCurrencyBRL(Number(order.shipment.cost))}
            </p>
            <form action={updateShipmentWithId} className="flex items-center gap-2">
              <input
                name="trackingCode"
                placeholder="Código de rastreio"
                defaultValue={order.shipment.trackingCode ?? ""}
                className="rounded border px-2 py-1"
              />
              <select name="status" defaultValue={order.shipment.status} className="rounded border px-2 py-1">
                <option value="PENDENTE">Pendente</option>
                <option value="POSTADO">Postado</option>
                <option value="EM_TRANSITO">Em trânsito</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="EXTRAVIADO">Extraviado</option>
              </select>
              <button type="submit" className="rounded border border-neutral-900 px-3 py-1 text-sm">
                Atualizar
              </button>
            </form>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Sincronização com Sigecloud</h2>
        {order.sigecloudSync ? (
          <div className="text-sm space-y-2">
            <p>Status: {order.sigecloudSync.status}</p>
            <p>Tentativas: {order.sigecloudSync.attempts}</p>
            {order.sigecloudSync.lastError && (
              <p className="text-red-600">Último erro: {order.sigecloudSync.lastError}</p>
            )}
            {order.sigecloudSync.sigecloudOrderId && (
              <p>ID no Sigecloud: {order.sigecloudSync.sigecloudOrderId}</p>
            )}
            {order.sigecloudSync.status !== "ENVIADO" && (
              <form action={resyncWithId}>
                <button type="submit" className="rounded border border-neutral-900 px-3 py-1 text-sm">
                  Reenviar para o Sigecloud
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Sem registro de sincronização.</p>
        )}
      </section>
    </div>
  );
}
