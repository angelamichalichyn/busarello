const BASE_STYLE = `font-family: Georgia, 'Times New Roman', serif; background: #f6f2e9; padding: 32px 16px; color: #2b2a24;`;
const CARD_STYLE = `max-width: 480px; margin: 0 auto; background: #fffdf9; border-radius: 12px; padding: 32px; border: 1px solid #e7e0d2;`;
const BUTTON_STYLE = `display: inline-block; background: #ad663d; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px; margin-top: 16px;`;

export function welcomeEmailHtml(name: string) {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <h1 style="color: #1c2e1b; font-size: 24px; margin: 0 0 16px;">Bem-vindo(a), ${name}!</h1>
        <p style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #2b2a24;">
          Sua conta na Busarello Estofados foi criada com sucesso. A partir de agora você pode
          acompanhar seus pedidos, salvar endereços e agilizar suas próximas compras.
        </p>
        <a href="https://busarelloestofados.com.br/colchoes" style="${BUTTON_STYLE}">Ver colchões</a>
      </div>
    </div>
  `;
}

export function orderConfirmationEmailHtml(input: {
  orderNumber: string;
  customerName: string;
  items: { productName: string; size: string; quantity: number; unitPrice: number }[];
  total: number;
}) {
  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const itemsHtml = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; font-family: Arial, sans-serif; font-size: 13px; color: #2b2a24;">
            ${item.productName} (${item.size}) x${item.quantity}
          </td>
          <td style="padding: 8px 0; font-family: Arial, sans-serif; font-size: 13px; color: #2b2a24; text-align: right;">
            ${formatBRL(item.unitPrice * item.quantity)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <h1 style="color: #1c2e1b; font-size: 24px; margin: 0 0 8px;">Pedido confirmado!</h1>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #2b2a24;">
          Olá, ${input.customerName}. Recebemos o pagamento do seu pedido
          <strong>#${input.orderNumber}</strong>.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; border-top: 1px solid #e7e0d2;">
          ${itemsHtml}
        </table>
        <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e7e0d2; font-family: Arial, sans-serif;">
          <strong style="color: #1c2e1b;">Total</strong>
          <strong style="color: #ad663d;">${formatBRL(input.total)}</strong>
        </div>
        <a href="https://busarelloestofados.com.br/pedido/${input.orderNumber}" style="${BUTTON_STYLE}">
          Acompanhar pedido
        </a>
      </div>
    </div>
  `;
}
