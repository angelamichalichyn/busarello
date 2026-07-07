import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contato | Busarello Estofados",
  description: "Entre em contato com a Busarello Estofados.",
};

// TODO: substituir pelos dados reais da loja assim que disponíveis.
const CONTACT_PHONE = "(00) 0000-0000";
const CONTACT_WHATSAPP_DISPLAY = "(00) 00000-0000";
const CONTACT_WHATSAPP_LINK = "#";
const CONTACT_EMAIL = "contato@busarelloestofados.com.br";
const CONTACT_ADDRESS = "Endereço a confirmar";

const contactInfo = [
  { icon: Phone, title: "Telefone", info: CONTACT_PHONE, href: `tel:${CONTACT_PHONE}` },
  { icon: MessageCircle, title: "WhatsApp", info: CONTACT_WHATSAPP_DISPLAY, href: CONTACT_WHATSAPP_LINK },
  { icon: Mail, title: "E-mail", info: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: MapPin, title: "Endereço", info: CONTACT_ADDRESS, href: "#" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Contato" }]} />

      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="eyebrow mb-4">Fale conosco</p>
        <h1 className="font-serif text-4xl text-pine mb-4">Estamos aqui para ajudar</h1>
        <p className="text-ink/60">
          Seja para tirar dúvidas sobre produtos, solicitar um orçamento ou saber o status do
          seu pedido, nossa equipe está pronta para atender você.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactInfo.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="card p-6 text-center hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-clay/10 flex items-center justify-center mx-auto mb-4 text-clay group-hover:bg-clay group-hover:text-white transition-colors">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-pine mb-2">{item.title}</h3>
            <p className="text-sm text-ink/70">{item.info}</p>
          </a>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl text-pine mb-6">Envie uma mensagem</h2>
        <div className="card p-6 md:p-8">
          <ContactForm contactEmail={CONTACT_EMAIL} />
        </div>
      </div>
    </div>
  );
}
