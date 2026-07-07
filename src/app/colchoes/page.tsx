import { Suspense } from "react";
import { Bed } from "lucide-react";
import { getProductsByCategory, getAvailableSizes, type SortOption } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { CatalogFilters } from "@/components/CatalogFilters";

export const metadata = { title: "Colchões | Busarello Estofados" };

export default async function ColchoesPage({
  searchParams,
}: {
  searchParams: Promise<{ tamanho?: string; preco?: string; ordenar?: string }>;
}) {
  const { tamanho, preco, ordenar } = await searchParams;
  const [minPrice, maxPrice] = preco ? preco.split("-").map((v) => (v ? Number(v) : undefined)) : [undefined, undefined];

  const [products, sizes] = await Promise.all([
    getProductsByCategory("COLCHAO", {
      size: tamanho || undefined,
      minPrice,
      maxPrice,
      sort: (ordenar as SortOption) || "relevancia",
    }),
    getAvailableSizes("COLCHAO"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Colchões" }]} />
      <div className="mb-10">
        <p className="eyebrow mb-2">Categoria</p>
        <h1 className="font-serif text-3xl text-pine">Colchões</h1>
      </div>

      <Suspense>
        <CatalogFilters sizes={sizes} />
      </Suspense>

      {products.length === 0 ? (
        <EmptyState
          title="Nenhum colchão encontrado"
          description="Tente ajustar os filtros ou volte em breve para conferir novidades."
          icon={<Bed className="w-10 h-10 text-ink/30" />}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              category={product.category}
              image={product.images[0]}
              fromPrice={product.minPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}
