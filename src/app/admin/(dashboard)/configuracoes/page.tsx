import { isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { isSigecloudConfigured } from "@/lib/integrations/sigecloud";
import { isResendConfigured } from "@/lib/integrations/email";
import { isVercelBlobConfigured } from "@/lib/upload";
import { getStoreSettings, updateStoreSettings } from "@/lib/actions/admin-settings";

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`admin-badge ${
        ok ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
      }`}
    >
      {ok ? "Conectado" : "Não configurado"}
    </span>
  );
}

export default async function AdminSettingsPage() {
  const frenetConfigured = Boolean(process.env.FRENET_TOKEN && process.env.FRENET_SELLER_CEP);
  const settings = await getStoreSettings();

  const integrations = [
    { name: "Mercado Pago", description: "Pagamentos (Checkout Transparente)", ok: isMercadoPagoConfigured() },
    { name: "Frenet", description: "Cálculo de frete e transportadoras", ok: frenetConfigured },
    { name: "Sigecloud", description: "Exportação de pedidos para o ERP", ok: isSigecloudConfigured() },
    { name: "Resend", description: "Envio de e-mails transacionais", ok: isResendConfigured() },
    { name: "Vercel Blob", description: "Upload de fotos de produtos", ok: isVercelBlobConfigured() },
  ];

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

        <form action={updateStoreSettings} className="admin-card p-6 space-y-4">
          <h2 className="text-xs tracking-wide uppercase text-zinc-500">Dados da loja</h2>
          <div>
            <label className="block text-sm mb-1 text-zinc-300">Nome da loja</label>
            <input name="storeName" defaultValue={settings.storeName} required className="admin-input" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-zinc-300">WhatsApp (com DDI/DDD)</label>
            <input
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              placeholder="5541999321204"
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-zinc-300">Máximo de parcelas</label>
            <input
              name="maxInstallments"
              type="number"
              min={1}
              max={24}
              defaultValue={settings.maxInstallments}
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-btn-primary">
            Salvar
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 mb-3">Integrações</h2>
        <p className="text-sm text-zinc-500 mb-4">
          As credenciais são definidas por variáveis de ambiente (.env) e nunca ficam visíveis
          aqui — esta página só mostra se cada integração está conectada.
        </p>

        <div className="admin-card divide-y divide-zinc-800">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4">
              <div>
                <p className="text-zinc-200">{integration.name}</p>
                <p className="text-sm text-zinc-500">{integration.description}</p>
              </div>
              <StatusBadge ok={integration.ok} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
