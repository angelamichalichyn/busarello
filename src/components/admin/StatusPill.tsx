const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  AGUARDANDO_PAGAMENTO: { label: "Aguardando", className: "bg-zinc-700 text-zinc-200" },
  PAGO: { label: "Pago", className: "bg-green-500/15 text-green-400" },
  ENVIADO: { label: "Enviado", className: "bg-blue-500/15 text-blue-400" },
  ENTREGUE: { label: "Entregue", className: "bg-emerald-500/15 text-emerald-400" },
  CANCELADO: { label: "Cancelado", className: "bg-red-500/15 text-red-400" },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-zinc-700 text-zinc-200" },
  APPROVED: { label: "Aprovado", className: "bg-green-500/15 text-green-400" },
  REJECTED: { label: "Recusado", className: "bg-red-500/15 text-red-400" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500/15 text-red-400" },
  REFUNDED: { label: "Reembolsado", className: "bg-purple-500/15 text-purple-400" },
};

const SHIPMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-zinc-700 text-zinc-200" },
  POSTADO: { label: "Postado", className: "bg-blue-500/15 text-blue-400" },
  EM_TRANSITO: { label: "Em trânsito", className: "bg-blue-500/15 text-blue-400" },
  ENTREGUE: { label: "Entregue", className: "bg-emerald-500/15 text-emerald-400" },
  EXTRAVIADO: { label: "Extraviado", className: "bg-red-500/15 text-red-400" },
};

const SYNC_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-zinc-700 text-zinc-200" },
  ENVIADO: { label: "Enviado", className: "bg-green-500/15 text-green-400" },
  ERRO: { label: "Erro", className: "bg-red-500/15 text-red-400" },
};

const EMAIL_STATUS_MAP: Record<string, { label: string; className: string }> = {
  sent: { label: "Enviado", className: "bg-green-500/15 text-green-400" },
  failed: { label: "Falhou", className: "bg-red-500/15 text-red-400" },
};

const MAPS = {
  order: ORDER_STATUS_MAP,
  payment: PAYMENT_STATUS_MAP,
  shipment: SHIPMENT_STATUS_MAP,
  sync: SYNC_STATUS_MAP,
  email: EMAIL_STATUS_MAP,
};

export function StatusPill({
  status,
  type = "order",
}: {
  status: string;
  type?: keyof typeof MAPS;
}) {
  const entry = MAPS[type][status] ?? { label: status, className: "bg-zinc-700 text-zinc-200" };
  return <span className={`admin-badge ${entry.className}`}>{entry.label}</span>;
}
