import { Sofa } from "lucide-react";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Estofados | Busarello Estofados" };

export default async function EstofadosPage() {
  const products = await getProductsByCategory("ESTOFADO");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Estofados" }]} />
      <div className="mb-10">
        <p className="eyebrow mb-2">Categoria</p>
        <h1 className="font-serif text-3xl text-pine">Estofados</h1>
      </div>
      {products.length === 0 ? (
        <EmptyState
          title="Nenhum estofado disponível"
          description="Estamos preparando novidades. Volte em breve para conferir nossa coleção."
          icon={<Sofa className="w-10 h-10 text-ink/30" />}
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
              fromPrice={Number(product.variants[0]?.price ?? 0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
