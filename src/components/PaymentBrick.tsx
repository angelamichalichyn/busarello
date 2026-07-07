"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export function PaymentBrick({
  publicKey,
  orderNumber,
  amount,
  payerEmail,
}: {
  publicKey: string;
  orderNumber: string;
  amount: number;
  payerEmail: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  initMercadoPago(publicKey, { locale: "pt-BR" });

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {pendingMessage && <p className="mb-4 text-sm text-amber-700">{pendingMessage}</p>}
      <Payment
        initialization={{
          amount,
          payer: { email: payerEmail },
        }}
        customization={{
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
          },
          visual: {
            style: {
              theme: "flat",
              customVariables: {
                baseColor: "#ad663d",
                formBackgroundColor: "#fffdf9",
              },
            },
          },
        }}
        onSubmit={async ({ formData }) => {
          setError(null);
          const res = await fetch("/api/payments/mercadopago", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber, formData }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            setError(data.error ?? "Não foi possível processar o pagamento");
            throw new Error(data.error ?? "payment_error");
          }

          if (data.status === "rejected") {
            setError("Pagamento recusado. Verifique os dados e tente novamente.");
            throw new Error("payment_rejected");
          }

          if (data.status === "approved") {
            router.push(`/pedido/${orderNumber}`);
          } else {
            setPendingMessage(
              "Pagamento em processamento. Você será notificado assim que for confirmado."
            );
            router.push(`/pedido/${orderNumber}`);
          }
        }}
        onError={(brickError) => {
          console.error(brickError);
          setError("Ocorreu um erro no formulário de pagamento.");
        }}
      />
    </div>
  );
}
