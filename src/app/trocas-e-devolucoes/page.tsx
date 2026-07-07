import { RotateCcw, CalendarClock, PackageCheck, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Trocas e Devoluções | Busarello Estofados",
  description: "Como funcionam as trocas e devoluções na Busarello Estofados.",
};

const steps = [
  {
    icon: CalendarClock,
    title: "Direito de arrependimento",
    description:
      "Conforme o Código de Defesa do Consumidor (Art. 49), você pode desistir da compra em até 7 dias corridos após o recebimento do produto, sem precisar justificar o motivo.",
  },
  {
    icon: PackageCheck,
    title: "Condições do produto",
    description:
      "Para troca ou devolução, o produto deve estar sem sinais de uso, na embalagem original, acompanhado da nota fiscal.",
  },
  {
    icon: RotateCcw,
    title: "Produtos com defeito",
    description:
      "Caso identifique algum defeito de fabricação, entre em contato conosco para avaliação e substituição ou reparo do produto.",
  },
  {
    icon: MessageCircle,
    title: "Como solicitar",
    description:
      "Entre em contato pelo nosso canal de atendimento informando o número do pedido para iniciarmos o processo de troca ou devolução.",
  },
];

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Trocas e Devoluções" }]} />

      <div className="text-center mb-12">
        <p className="eyebrow mb-4">Informações</p>
        <h1 className="font-serif text-4xl text-pine mb-4">Trocas e Devoluções</h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          Queremos que você tenha total confiança na sua compra. Confira como funcionam
          nossas trocas e devoluções.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {steps.map((step) => (
          <div key={step.title} className="card p-8">
            <div className="w-12 h-12 rounded-full bg-clay/10 flex items-center justify-center text-clay mb-4">
              <step.icon className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-pine mb-3">{step.title}</h2>
            <p className="text-sm text-ink/70 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-sand/20 rounded-2xl p-8 text-center">
        <p className="text-ink/70 mb-4">Precisa solicitar uma troca ou devolução?</p>
        <Link href="/contato" className="btn-primary inline-block">
          Fale conosco
        </Link>
      </div>
    </div>
  );
}
