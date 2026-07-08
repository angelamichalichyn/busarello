"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/require-admin";

const settingsSchema = z.object({
  storeName: z.string().min(2),
  whatsappNumber: z.string().min(8),
  maxInstallments: z.coerce.number().int().min(1).max(24),
});

export async function getStoreSettings() {
  return prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", storeName: "Busarello Estofados", whatsappNumber: "", maxInstallments: 12 },
  });
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin();

  const parsed = settingsSchema.parse({
    storeName: formData.get("storeName"),
    whatsappNumber: formData.get("whatsappNumber"),
    maxInstallments: formData.get("maxInstallments"),
  });

  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: parsed,
    create: { id: "singleton", ...parsed },
  });

  revalidatePath("/admin/configuracoes");
}
