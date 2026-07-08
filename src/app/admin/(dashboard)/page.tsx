import Link from "next/link";
import { ShoppingBag, Truck, DollarSign, Package, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { StatusPill } from "@/components/admin/StatusPill";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboardPage() {
  const [
    pendingCount,
    toShipOrders,
    revenueResult,
    activeProductsCount,
    lowStockVariants,
    recentOrders,
    failedSyncs,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "AGUARDANDO_PAGAMENTO" } }),
    prisma.order.findMany({
      where: { status: "PAGO" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.aggregate({
      where: { status: { in: ["PAGO", "ENVIADO", "ENTREGUE"] } },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { active: true } }),
    prisma.productVariant.findMany({
      where: { active: true, stockQuantity: { lte: LOW_STOCK_THRESHOLD } },
      include: { product: true },
      orderBy: { stockQuantity: "asc" },
      take: 5,
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.sigecloudSync.findMany({
      where: { status: "ERRO" },
      include: { order: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "Pedidos pendentes", value: pendingCount, icon: ShoppingBag, iconColor: "text-clay" },
    { label: "A despachar (pagos)", value: toShipOrders.length, icon: Truck, iconColor: "text-blue-600" },
    {
      label: "Receita",
      value: formatCurrencyBRL(Number(revenueResult._sum.total ?? 0)),
      icon: DollarSign,
      iconColor: "text-green-600",
    },
    { label: "Produtos ativos", value: activeProductsCount, icon: Package, iconColor: "text-pine" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-pine">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-5">
            <div className="flex items-center gap-2 text-ink/60 text-sm mb-3">
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              {stat.label}
            </div>
            <p className="text-2xl font-bold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {lowStockVariants.length > 0 && (
        <div className="admin-card border-amber-300 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-700 font-medium mb-3">
            <AlertTriangle className="w-4 h-4" />
            Estoque baixo
          </div>
          <ul className="space-y-1 text-sm">
            {lowStockVariants.map((v) => (
              <li key={v.id}>
                <Link href={`/admin/produtos/${v.productId}`} className="text-ink/70 hover:text-ink">
                  {v.product.name} ({v.size}) — {v.stockQuantity} restantes
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {failedSyncs.length > 0 && (
        <div className="admin-card border-red-300 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-red-700 font-medium mb-3">
            <AlertTriangle className="w-4 h-4" />
            Falha na sincronização com o Sigecloud
          </div>
          <ul className="space-y-1 text-sm">
            {failedSyncs.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/pedidos/${s.orderId}`} className="text-ink/70 hover:text-ink">
                  Pedido {s.order.orderNumber} — {s.lastError}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-card p-5">
        <div className="flex items-center gap-2 font-medium text-pine mb-4">
          <Truck className="w-4 h-4 text-blue-600" />
          A despachar ({toShipOrders.length})
        </div>
        {toShipOrders.length === 0 ? (
          <p className="text-sm text-ink/50">Nenhum pedido aguardando despacho.</p>
        ) : (
          <div className="divide-y divide-sand-light">
            {toShipOrders.slice(0, 6).map((order) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-clay"
              >
                <div>
                  <p className="text-ink">{order.shippingRecipientName}</p>
                  <p className="text-ink/50 text-xs">
                    {order.shippingCity}/{order.shippingState} · {order.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-clay font-medium">{formatCurrencyBRL(Number(order.total))}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium text-pine">Pedidos recentes</p>
          <Link href="/admin/pedidos" className="text-xs text-clay hover:text-clay-dark">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-sand-light">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex items-center justify-between py-3 text-sm hover:text-clay"
            >
              <span className="text-ink">{order.orderNumber}</span>
              <StatusPill status={order.status} />
              <span className="text-clay font-medium">{formatCurrencyBRL(Number(order.total))}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
