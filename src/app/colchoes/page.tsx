import { Bed } from "lucide-react";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Colchões | Busarello Estofados" };

export default async function ColchoesPage() {
  const products = await getProductsByCategory("COLCHAO");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Colchões" }]} />
      <div className="mb-10">
        <p className="eyebrow mb-2">Categoria</p>
        <h1 className="font-serif text-3xl text-pine">Colchões</h1>
      </div>
      {products.length === 0 ? (
        <EmptyState
          title="Nenhum colchão disponível"
          description="Estamos preparando novidades. Volte em breve para conferir nossa coleção."
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
              fromPrice={Number(product.variants[0]?.price ?? 0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
