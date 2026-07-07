import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@/generated/prisma/client";

export function getProductsByCategory(category: ProductCategory) {
  return prisma.product.findMany({
    where: { category, active: true },
    include: { variants: { where: { active: true }, orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { variants: { where: { active: true }, orderBy: { price: "asc" } } },
  });
}

export function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { active: true },
    include: { variants: { where: { active: true }, orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
