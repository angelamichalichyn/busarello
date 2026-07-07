import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, Truck, ThumbsUp, ArrowRight } from "lucide-react";
import { getFeaturedProducts, getCategoryShowcase } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";

const highlights = [
  {
    icon: Award,
    title: "Qualidade de fábrica",
    description: "Colchões e estofados produzidos com materiais selecionados.",
  },
  {
    icon: Truck,
    title: "Entrega para todo o Brasil",
    description: "Frete calculado na hora, com as principais transportadoras.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
    description: "Cartão, Pix e boleto via Mercado Pago.",
  },
  {
    icon: ThumbsUp,
    title: "Satisfação garantida",
    description: "Atendimento dedicado do início ao pós-venda.",
  },
];

export default async function HomePage() {
  const [featured, showcase] = await Promise.all([getFeaturedProducts(), getCategoryShowcase()]);

  return (
    <div>
      <section className="bg-sand-light/50">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="eyebrow mb-4">Busarello Estofados</p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-pine mb-5">
            Conforto que você sente todos os dias
          </h1>
          <p className="text-ink/70 max-w-xl mx-auto mb-10">
            Colchões e estofados de qualidade, direto de fábrica, com entrega para todo o
            Brasil.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/colchoes" className="btn-primary">Ver colchões</Link>
            <Link href="/estofados" className="btn-outline">Ver estofados</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-clay/10 flex items-center justify-center text-clay mb-3 mx-auto sm:mx-0">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-pine mb-1">{title}</h3>
              <p className="text-sm text-ink/60">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <Link
            href="/colchoes"
            className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-pine flex items-end"
          >
            {showcase.colchao && (
              <Image
                src={showcase.colchao}
                alt="Colchões"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative p-8 text-cream">
              <h3 className="font-serif text-3xl mb-2">Colchões</h3>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Ver coleção <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link
            href="/estofados"
            className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-clay flex items-end"
          >
            {showcase.estofado && (
              <Image
                src={showcase.estofado}
                alt="Estofados"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative p-8 text-cream">
              <h3 className="font-serif text-3xl mb-2">Estofados</h3>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Ver coleção <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Selecionados para você</p>
          <h2 className="font-serif text-3xl text-pine">Destaques</h2>
        </div>
        {featured.length === 0 ? (
          <p className="text-ink/60 text-center">Em breve, novos produtos.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {featured.map((product) => (
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
      </section>
    </div>
  );
}
