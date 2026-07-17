import { prisma } from "@/lib/prisma";

export type SortOption = "relevancia" | "menor-preco" | "maior-preco" | "nome-az";

export type ProductFilters = {
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
};

const variantInclude = { where: { active: true as const }, orderBy: { price: "asc" as const } };

export async function getProductsByCategorySlug(categorySlug: string, filters: ProductFilters = {}) {
  const { size, minPrice, maxPrice, sort = "relevancia" } = filters;

  const priceFilter =
    minPrice !== undefined || maxPrice !== undefined
      ? { gte: minPrice, lte: maxPrice }
      : undefined;

  const products = await prisma.product.findMany({
    where: {
      category: { slug: categorySlug },
      active: true,
      variants: {
        some: {
          active: true,
          ...(size ? { size } : {}),
          ...(priceFilter ? { price: priceFilter } : {}),
        },
      },
    },
    include: { variants: variantInclude, category: true },
    orderBy: { createdAt: "desc" },
  });

  const withMinPrice = products.map((p) => ({
    ...p,
    minPrice: p.variants.length > 0 ? Math.min(...p.variants.map((v) => Number(v.price))) : 0,
  }));

  switch (sort) {
    case "menor-preco":
      withMinPrice.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case "maior-preco":
      withMinPrice.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case "nome-az":
      withMinPrice.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      break;
    default:
      break;
  }

  return withMinPrice;
}

export function getAvailableSizes(categorySlug: string) {
  return prisma.productVariant
    .findMany({
      where: { active: true, product: { category: { slug: categorySlug }, active: true } },
      select: { size: true },
      distinct: ["size"],
    })
    .then((rows) => rows.map((r) => r.size));
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { variants: variantInclude, category: true },
  });
}

export function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { active: true },
    include: { variants: variantInclude, category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, active: true, id: { not: excludeProductId } },
    include: { variants: variantInclude, category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCategoryShowcase() {
  const [colchaoCategory, estofadoCategory] = await Promise.all([
    prisma.category.findUnique({ where: { slug: "colchao" }, select: { imageUrl: true } }),
    prisma.category.findUnique({ where: { slug: "estofado" }, select: { imageUrl: true } }),
  ]);

  const [colchaoProduct, estofadoProduct] = await Promise.all([
    colchaoCategory?.imageUrl
      ? null
      : prisma.product.findFirst({
          where: { category: { slug: "colchao" }, active: true, images: { isEmpty: false } },
          select: { images: true },
          orderBy: { createdAt: "desc" },
        }),
    estofadoCategory?.imageUrl
      ? null
      : prisma.product.findFirst({
          where: { category: { slug: "estofado" }, active: true, images: { isEmpty: false } },
          select: { images: true },
          orderBy: { createdAt: "desc" },
        }),
  ]);

  return {
    colchao: colchaoCategory?.imageUrl ?? colchaoProduct?.images[0],
    estofado: estofadoCategory?.imageUrl ?? estofadoProduct?.images[0],
  };
}

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
