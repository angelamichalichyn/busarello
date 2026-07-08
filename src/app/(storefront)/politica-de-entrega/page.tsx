import { Truck, Clock, Package, Shield } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Política de Entrega | Busarello Estofados",
  description: "Informações sobre prazos, fretes e rastreamento de entregas.",
};

const policies = [
  {
    icon: Truck,
    title: "Cálculo de frete",
    content: [
      "O frete é calculado automaticamente no checkout, de acordo com o seu CEP",
      "Trabalhamos com transportadoras parceiras para todo o Brasil",
      "Você escolhe a opção de envio antes de finalizar o pedido",
    ],
  },
  {
    icon: Clock,
    title: "Prazos",
    content: [
      "O prazo de entrega começa a contar após a confirmação do pagamento",
      "O prazo estimado é exibido no checkout antes da compra",
      "Em caso de atraso, entraremos em contato para reagendamento",
    ],
  },
  {
    icon: Package,
    title: "Rastreamento",
    content: [
      "Você pode acompanhar o status do seu pedido em Minha Conta > Pedidos",
      "O código de rastreio é disponibilizado assim que o pedido é postado",
      "Atualizações de status ficam disponíveis na página do pedido",
    ],
  },
  {
    icon: Shield,
    title: "Cuidado no transporte",
    content: [
      "Todos os produtos são embalados com proteção reforçada",
      "Qualquer avaria deve ser reportada no ato da entrega",
      "Nossa equipe está disponível para ajudar em qualquer imprevisto",
    ],
  },
];

export default function DeliveryPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Política de Entrega" }]} />

      <div className="text-center mb-12">
        <p className="eyebrow mb-4">Informações</p>
        <h1 className="font-serif text-4xl text-pine mb-4">Política de Entrega</h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          Nosso compromisso é entregar seu produto com segurança, pontualidade e o cuidado
          que ele merece.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {policies.map((policy) => (
          <div key={policy.title} className="card p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-clay">
                <policy.icon className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-xl text-pine">{policy.title}</h2>
            </div>
            <ul className="space-y-2">
              {policy.content.map((item, index) => (
                <li key={index} className="text-sm text-ink/70 flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-sand/20 rounded-2xl p-8 text-center">
        <p className="text-ink/70 mb-4">Dúvidas sobre entrega? Entre em contato conosco.</p>
        <Link href="/contato" className="btn-primary inline-block">
          Fale conosco
        </Link>
      </div>
    </div>
  );
}
