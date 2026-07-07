import Image from "next/image";
import Link from "next/link";
import { AtSign, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-pine text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Image
            src="/brand/logo-wordmark.png"
            alt="Busarello Estofados"
            width={200}
            height={63}
            className="h-11 w-auto opacity-95"
          />
          <p className="text-sm text-cream/70 leading-relaxed max-w-xs">
            Colchões e estofados de qualidade, direto de fábrica, com entrega para todo o
            Brasil.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-clay hover:border-clay transition-colors"
              aria-label="Instagram"
            >
              <AtSign className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-clay hover:border-clay transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-lg text-sand">Loja</h4>
          <nav className="flex flex-col space-y-3 text-sm">
            <Link href="/colchoes" className="text-cream/70 hover:text-sand transition-colors">Colchões</Link>
            <Link href="/estofados" className="text-cream/70 hover:text-sand transition-colors">Estofados</Link>
            <Link href="/carrinho" className="text-cream/70 hover:text-sand transition-colors">Carrinho</Link>
            <Link href="/conta" className="text-cream/70 hover:text-sand transition-colors">Minha conta</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-lg text-sand">Atendimento</h4>
          <nav className="flex flex-col space-y-3 text-sm">
            <Link href="/contato" className="text-cream/70 hover:text-sand transition-colors">Fale Conosco</Link>
            <Link href="/sobre" className="text-cream/70 hover:text-sand transition-colors">Sobre Nós</Link>
            <Link href="/politica-de-entrega" className="text-cream/70 hover:text-sand transition-colors">Política de Entrega</Link>
            <Link href="/trocas-e-devolucoes" className="text-cream/70 hover:text-sand transition-colors">Trocas e Devoluções</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-lg text-sand">Contato</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-clay shrink-0" />
              <p className="text-cream/70">Endereço a confirmar</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-clay shrink-0" />
              <p className="text-cream/70">Telefone a confirmar</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-clay shrink-0" />
              <p className="text-cream/70">E-mail a confirmar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-sm text-cream/50 text-center">
            © {currentYear} Busarello Estofados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
