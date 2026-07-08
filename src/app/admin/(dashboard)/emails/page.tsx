import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/admin/StatusPill";

const TYPE_LABELS: Record<string, string> = {
  welcome: "Conta criada",
  order_confirmation: "Pedido confirmado",
};

export default async function AdminEmailsPage() {
  const logs = await prisma.emailLog.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pine">E-mails enviados</h1>
        <p className="text-ink/50 text-sm mt-1">{logs.length} registro(s)</p>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b border-sand-light">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Destinatário</th>
              <th className="px-4 py-3 font-medium">Assunto</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Pedido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-light">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-sand-light/50">
                <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                  {log.createdAt.toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-ink">{TYPE_LABELS[log.type] ?? log.type}</td>
                <td className="px-4 py-3 text-ink">{log.recipient}</td>
                <td className="px-4 py-3 text-ink max-w-xs truncate" title={log.subject}>
                  {log.subject}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <StatusPill status={log.status} type="email" />
                    {log.error && <span className="text-xs text-red-600">{log.error}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {log.order ? (
                    <Link href={`/admin/pedidos/${log.order.id}`} className="text-clay hover:text-clay-dark">
                      #{log.order.orderNumber}
                    </Link>
                  ) : (
                    <span className="text-ink/30">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="p-6 text-sm text-ink/50">Nenhum e-mail enviado ainda.</p>}
      </div>
    </div>
  );
}
