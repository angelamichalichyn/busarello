import { prisma } from "@/lib/prisma";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const DEFAULT_FROM = "Busarello Estofados <pedidos@busarelloestofados.com.br>";

type SendEmailInput = {
  type: "welcome" | "order_confirmation";
  to: string;
  subject: string;
  html: string;
  orderId?: string;
};

export async function sendEmail({ type, to, subject, html, orderId }: SendEmailInput) {
  if (!isResendConfigured()) {
    await prisma.emailLog.create({
      data: {
        type,
        recipient: to,
        subject,
        status: "failed",
        error: "RESEND_API_KEY não configurado",
        orderId,
      },
    });
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

    const result = await resend.emails.send({ from, to, subject, html });

    if (result.error) {
      throw new Error(result.error.message);
    }

    await prisma.emailLog.create({
      data: { type, recipient: to, subject, status: "sent", orderId },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    await prisma.emailLog.create({
      data: { type, recipient: to, subject, status: "failed", error: message, orderId },
    });
  }
}
