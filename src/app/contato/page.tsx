import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_LINK,
} from "@/lib/contact";

export const metadata = {
  title: "Contato | Busarello Estofados",
  description: "Entre em contato com a Busarello Estofados.",
};

const contactInfo = [
  { icon: Phone, title: "Telefone", info: CONTACT_PHONE_DISPLAY, href: `tel:${CONTACT_PHONE_TEL}` },
  { icon: MessageCircle, title: "WhatsApp", info: CONTACT_PHONE_DISPLAY, href: CONTACT_WHATSAPP_LINK },
  { icon: Mail, title: "E-mail", info: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: MapPin, title: "Endereço", info: CONTACT_ADDRESS_LINES.join(", "), href: "#mapa" },
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
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-2xl text-pine mb-6">Envie uma mensagem</h2>
          <div className="card p-6 md:p-8">
            <ContactForm contactEmail={CONTACT_EMAIL} />
          </div>
        </div>

        <div id="mapa">
          <h2 className="font-serif text-2xl text-pine mb-6">Onde estamos</h2>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand/20 relative">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                CONTACT_ADDRESS_LINES.join(", ")
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Busarello Estofados"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
