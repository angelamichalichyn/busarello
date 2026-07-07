import { isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { isSigecloudConfigured } from "@/lib/integrations/sigecloud";

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
        ok ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"
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
      <h1 className="text-2xl font-semibold mb-6">Configurações</h1>
      <p className="text-sm text-neutral-600 mb-6">
        As credenciais são definidas por variáveis de ambiente (.env) e nunca ficam visíveis
        aqui — esta página só mostra se cada integração está conectada.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded border p-4">
          <div>
            <p className="font-medium">Mercado Pago</p>
            <p className="text-sm text-neutral-500">Pagamentos (Checkout Transparente)</p>
          </div>
          <StatusBadge ok={isMercadoPagoConfigured()} />
        </div>

        <div className="flex items-center justify-between rounded border p-4">
          <div>
            <p className="font-medium">Frenet</p>
            <p className="text-sm text-neutral-500">Cálculo de frete e transportadoras</p>
          </div>
          <StatusBadge ok={frenetConfigured} />
        </div>

        <div className="flex items-center justify-between rounded border p-4">
          <div>
            <p className="font-medium">Sigecloud</p>
            <p className="text-sm text-neutral-500">Exportação de pedidos para o ERP</p>
          </div>
          <StatusBadge ok={isSigecloudConfigured()} />
        </div>
      </div>
    </div>
  );
}
