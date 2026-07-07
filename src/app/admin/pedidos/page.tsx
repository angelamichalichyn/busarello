import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";

const statusOptions = [
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "ENVIADO",
  "ENTREGUE",
  "CANCELADO",
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as (typeof statusOptions)[number] } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-pine mb-6">Pedidos</h1>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
        <Link href="/admin/pedidos" className={!status ? "text-clay" : "text-ink/60 hover:text-clay"}>
          Todos
        </Link>
        {statusOptions.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={status === s ? "text-clay" : "text-ink/60 hover:text-clay"}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/pedidos/${order.id}`}
            className="flex justify-between rounded-sm border border-sand-light p-3 text-sm text-ink hover:border-clay transition-colors"
          >
            <span>{order.orderNumber}</span>
            <span className="text-ink/60">{order.status}</span>
            <span className="text-clay">{formatCurrencyBRL(Number(order.total))}</span>
            <span className="text-ink/50">
              {order.createdAt.toLocaleDateString("pt-BR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
