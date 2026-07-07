/**
 * Integração com o ERP Sigecloud: exporta pedidos pagos como vendas.
 *
 * O formato exato do payload deve ser confirmado com a documentação da API
 * do Sigecloud (endpoint e nomes de campo) assim que as credenciais forem
 * configuradas — aqui usamos um contrato REST genérico e isolado nesta
 * função para que o restante do sistema não dependa desse detalhe.
 */
export type SigecloudOrderPayload = {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: { sku: string; description: string; quantity: number; unitPrice: number }[];
  shippingCost: number;
  total: number;
};

export function isSigecloudConfigured() {
  return Boolean(process.env.SIGECLOUD_API_URL && process.env.SIGECLOUD_API_KEY);
}

export async function exportOrderToSigecloud(payload: SigecloudOrderPayload): Promise<string> {
  const apiUrl = process.env.SIGECLOUD_API_URL;
  const apiKey = process.env.SIGECLOUD_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Sigecloud não configurado (SIGECLOUD_API_URL / SIGECLOUD_API_KEY ausentes)");
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Sigecloud respondeu ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as { id?: string; pedidoId?: string };
  const externalId = data.id ?? data.pedidoId;
  if (!externalId) {
    throw new Error("Sigecloud não retornou um identificador de pedido");
  }
  return externalId;
}
