const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  AGUARDANDO_PAGAMENTO: { label: "Aguardando", className: "bg-sand-light text-ink/70" },
  PAGO: { label: "Pago", className: "bg-green-100 text-green-700" },
  ENVIADO: { label: "Enviado", className: "bg-blue-100 text-blue-700" },
  ENTREGUE: { label: "Entregue", className: "bg-emerald-100 text-emerald-700" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-sand-light text-ink/70" },
  APPROVED: { label: "Aprovado", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Recusado", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Reembolsado", className: "bg-purple-100 text-purple-700" },
};

const SHIPMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-sand-light text-ink/70" },
  POSTADO: { label: "Postado", className: "bg-blue-100 text-blue-700" },
  EM_TRANSITO: { label: "Em trânsito", className: "bg-blue-100 text-blue-700" },
  ENTREGUE: { label: "Entregue", className: "bg-emerald-100 text-emerald-700" },
  EXTRAVIADO: { label: "Extraviado", className: "bg-red-100 text-red-700" },
};

const SYNC_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-sand-light text-ink/70" },
  ENVIADO: { label: "Enviado", className: "bg-green-100 text-green-700" },
  ERRO: { label: "Erro", className: "bg-red-100 text-red-700" },
};

const EMAIL_STATUS_MAP: Record<string, { label: string; className: string }> = {
  sent: { label: "Enviado", className: "bg-green-100 text-green-700" },
  failed: { label: "Falhou", className: "bg-red-100 text-red-700" },
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
  const entry = MAPS[type][status] ?? { label: status, className: "bg-sand-light text-ink/70" };
  return <span className={`admin-badge ${entry.className}`}>{entry.label}</span>;
}
