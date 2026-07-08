"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/require-admin";
import { slugify } from "@/lib/slug";

const categorySchema = z.object({
  name: z.string().min(2),
  emoji: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.parse({
    name: formData.get("name"),
    emoji: formData.get("emoji")?.toString() || undefined,
  });

  const baseSlug = slugify(parsed.name);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  await prisma.category.create({
    data: { name: parsed.name, slug, emoji: parsed.emoji },
  });

  revalidatePath("/admin/categorias");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.parse({
    name: formData.get("name"),
    emoji: formData.get("emoji")?.toString() || undefined,
  });

  await prisma.category.update({
    where: { id: categoryId },
    data: { name: parsed.name, emoji: parsed.emoji },
  });

  revalidatePath("/admin/categorias");
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    throw new Error(
      `Não é possível remover: ${productCount} produto(s) ainda estão nessa categoria.`
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categorias");
}
