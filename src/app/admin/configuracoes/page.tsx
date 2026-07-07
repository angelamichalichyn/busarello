import { isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { isSigecloudConfigured } from "@/lib/integrations/sigecloud";

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 text-xs tracking-wide ${
        ok ? "bg-pine/10 text-pine" : "bg-sand-light text-ink/50"
      }`}
    >
      {ok ? "Conectado" : "Não configurado"}
    </span>
  );
}

export default function AdminSettingsPage() {
  const frenetConfigured = Boolean(process.env.FRENET_TOKEN && process.env.FRENET_SELLER_CEP);

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl text-pine mb-6">Configurações</h1>
      <p className="text-sm text-ink/60 mb-6">
        As credenciais são definidas por variáveis de ambiente (.env) e nunca ficam visíveis
        aqui — esta página só mostra se cada integração está conectada.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-sm border border-sand-light p-4">
          <div>
            <p className="text-ink">Mercado Pago</p>
            <p className="text-sm text-ink/50">Pagamentos (Checkout Transparente)</p>
          </div>
          <StatusBadge ok={isMercadoPagoConfigured()} />
        </div>

        <div className="flex items-center justify-between rounded-sm border border-sand-light p-4">
          <div>
            <p className="text-ink">Frenet</p>
            <p className="text-sm text-ink/50">Cálculo de frete e transportadoras</p>
          </div>
          <StatusBadge ok={frenetConfigured} />
        </div>

        <div className="flex items-center justify-between rounded-sm border border-sand-light p-4">
          <div>
            <p className="text-ink">Sigecloud</p>
            <p className="text-sm text-ink/50">Exportação de pedidos para o ERP</p>
          </div>
          <StatusBadge ok={isSigecloudConfigured()} />
        </div>
      </div>
    </div>
  );
}
