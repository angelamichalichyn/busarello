import { Award, Heart, Shield, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Sobre Nós | Busarello Estofados",
  description: "Conheça a Busarello Estofados, especializada em colchões e estofados de qualidade.",
};

const values = [
  {
    icon: Award,
    title: "Qualidade de fábrica",
    description: "Produzimos colchões e estofados com materiais selecionados e acabamento cuidadoso.",
  },
  {
    icon: Heart,
    title: "Conforto em primeiro lugar",
    description: "Buscamos sempre o melhor equilíbrio entre conforto e durabilidade para sua casa.",
  },
  {
    icon: Shield,
    title: "Durabilidade",
    description: "Produtos pensados para o dia a dia, com materiais resistentes e de qualidade.",
  },
  {
    icon: ThumbsUp,
    title: "Satisfação garantida",
    description: "Atendimento próximo do cliente, do primeiro contato ao pós-venda.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Sobre Nós" }]} />

      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="eyebrow mb-4">Nossa história</p>
        <h1 className="font-serif text-4xl text-pine mb-6 leading-tight">
          Colchões e estofados feitos para durar
        </h1>
        <p className="text-ink/70 leading-relaxed">
          A Busarello Estofados se dedica à fabricação de colchões e estofados de qualidade,
          unindo conforto, durabilidade e bom atendimento para equipar a casa dos nossos
          clientes com peças feitas para o dia a dia.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="font-serif text-3xl text-pine text-center mb-12">Nossos valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-clay/10 flex items-center justify-center mx-auto mb-4 text-clay">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-pine mb-3">{value.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-pine rounded-2xl p-10 sm:p-12 text-center text-cream">
        <h2 className="font-serif text-3xl mb-4">Conheça nossa coleção</h2>
        <p className="text-cream/70 max-w-xl mx-auto mb-8">
          Explore nossos colchões e estofados e encontre a peça ideal para o seu lar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/colchoes" className="btn-primary">Ver colchões</Link>
          <Link href="/contato" className="btn-outline border-cream text-cream hover:bg-cream/10">
            Fale conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
