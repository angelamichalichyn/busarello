"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/require-admin";
import { slugify } from "@/lib/slug";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["COLCHAO", "ESTOFADO"]),
  description: z.string().min(1),
  images: z.string().optional(),
  active: z.boolean(),
});

function parseImages(raw: string | undefined) {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    images: formData.get("images")?.toString(),
    active: formData.get("active") === "on",
  });

  const baseSlug = slugify(parsed.name);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.name,
      slug,
      category: parsed.category,
      description: parsed.description,
      images: parseImages(parsed.images),
      active: parsed.active,
    },
  });

  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    images: formData.get("images")?.toString(),
    active: formData.get("active") === "on",
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.name,
      category: parsed.category,
      description: parsed.description,
      images: parseImages(parsed.images),
      active: parsed.active,
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
}

const variantSchema = z.object({
  size: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().min(0),
  weightKg: z.coerce.number().positive(),
  heightCm: z.coerce.number().positive(),
  widthCm: z.coerce.number().positive(),
  lengthCm: z.coerce.number().positive(),
  active: z.boolean(),
});

export async function createVariant(productId: string, formData: FormData) {
  await requireAdmin();

  const parsed = variantSchema.parse({
    size: formData.get("size"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stockQuantity: formData.get("stockQuantity"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    widthCm: formData.get("widthCm"),
    lengthCm: formData.get("lengthCm"),
    active: formData.get("active") === "on",
  });

  await prisma.productVariant.create({
    data: { ...parsed, productId },
  });

  revalidatePath(`/admin/produtos/${productId}`);
}

export async function updateVariant(productId: string, variantId: string, formData: FormData) {
  await requireAdmin();

  const parsed = variantSchema.parse({
    size: formData.get("size"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stockQuantity: formData.get("stockQuantity"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    widthCm: formData.get("widthCm"),
    lengthCm: formData.get("lengthCm"),
    active: formData.get("active") === "on",
  });

  await prisma.productVariant.update({
    where: { id: variantId },
    data: parsed,
  });

  revalidatePath(`/admin/produtos/${productId}`);
}

export async function deleteVariant(productId: string, variantId: string) {
  await requireAdmin();
  await prisma.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/produtos/${productId}`);
}
