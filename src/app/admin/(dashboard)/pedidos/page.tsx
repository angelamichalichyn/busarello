import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { StatusPill } from "@/components/admin/StatusPill";

const statusOptions = [
  { value: "AGUARDANDO_PAGAMENTO", label: "Aguardando" },
  { value: "PAGO", label: "Pagos" },
  { value: "ENVIADO", label: "Enviados" },
  { value: "ENTREGUE", label: "Entregues" },
  { value: "CANCELADO", label: "Cancelados" },
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as (typeof statusOptions)[number]["value"] } : undefined,
    include: { user: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-pine mb-6">Pedidos</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/pedidos"
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            !status ? "bg-clay text-white" : "bg-sand-light text-ink/60 hover:text-ink"
          }`}
        >
          Todos
        </Link>
        {statusOptions.map((s) => (
          <Link
            key={s.value}
            href={`/admin/pedidos?status=${s.value}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              status === s.value ? "bg-clay text-white" : "bg-sand-light text-ink/60 hover:text-ink"
            }`}
          >
            {s.label.toUpperCase()}
          </Link>
        ))}
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b border-sand-light">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Método</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-light">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-sand-light/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-clay font-medium">
                    #{order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink">{order.user?.name ?? order.guestName}</p>
                  <p className="text-ink/50 text-xs">{order.user?.email ?? order.guestEmail}</p>
                </td>
                <td className="px-4 py-3 text-ink/70">{order.payment?.method ?? "—"}</td>
                <td className="px-4 py-3 text-ink font-medium">{formatCurrencyBRL(Number(order.total))}</td>
                <td className="px-4 py-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-4 py-3 text-ink/50">{order.createdAt.toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-sm text-ink/50">Nenhum pedido encontrado.</p>}
      </div>
    </div>
  );
}
