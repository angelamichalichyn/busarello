"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/require-admin";
import { syncOrderToSigecloud } from "@/lib/sigecloud-sync";

export async function resyncOrderToSigecloud(orderId: string) {
  await requireAdmin();
  await syncOrderToSigecloud(orderId);
  revalidatePath(`/admin/pedidos/${orderId}`);
}

const shipmentUpdateSchema = z.object({
  trackingCode: z.string().optional(),
  status: z.enum(["PENDENTE", "POSTADO", "EM_TRANSITO", "ENTREGUE", "EXTRAVIADO"]),
});

export async function updateShipmentStatus(orderId: string, formData: FormData) {
  await requireAdmin();

  const parsed = shipmentUpdateSchema.parse({
    trackingCode: formData.get("trackingCode")?.toString() || undefined,
    status: formData.get("status"),
  });

  await prisma.shipment.update({
    where: { orderId },
    data: { trackingCode: parsed.trackingCode, status: parsed.status },
  });

  if (parsed.status === "POSTADO" || parsed.status === "EM_TRANSITO") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "ENVIADO" } });
  }
  if (parsed.status === "ENTREGUE") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "ENTREGUE" } });
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
}
