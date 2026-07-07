import { MercadoPagoConfig, Payment } from "mercadopago";

let client: MercadoPagoConfig | null = null;

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  }
  if (!client) {
    client = new MercadoPagoConfig({ accessToken });
  }
  return client;
}

export function isMercadoPagoConfigured() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

/**
 * `brickFormData` é o objeto retornado pelo callback onSubmit do Payment
 * Brick (@mercadopago/sdk-react) — já vem no formato esperado pela API de
 * pagamentos do Mercado Pago (token, payment_method_id, installments,
 * issuer_id, payer, etc). O valor e a referência do pedido são sempre
 * definidos no servidor para não confiar em dados vindos do cliente.
 */
export async function createMercadoPagoPayment(
  brickFormData: Record<string, unknown>,
  overrides: { orderNumber: string; transactionAmount: number; description: string }
) {
  const payment = new Payment(getClient());

  return payment.create({
    body: {
      ...brickFormData,
      transaction_amount: overrides.transactionAmount,
      description: overrides.description,
      external_reference: overrides.orderNumber,
    },
    requestOptions: {
      idempotencyKey: `${overrides.orderNumber}-${Date.now()}`,
    },
  });
}

export async function getMercadoPagoPayment(paymentId: string) {
  const payment = new Payment(getClient());
  return payment.get({ id: paymentId });
}
