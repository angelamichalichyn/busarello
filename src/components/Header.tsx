import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCartItemCount } from "@/lib/cart";

export async function Header() {
  const [session, cartCount] = await Promise.all([auth(), getCartItemCount()]);

  return (
    <header className="border-b border-sand-light bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-wordmark.png"
            alt="Busarello Estofados"
            width={220}
            height={69}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm tracking-wide">
          <Link href="/colchoes" className="text-ink/80 hover:text-clay transition-colors">Colchões</Link>
          <Link href="/estofados" className="text-ink/80 hover:text-clay transition-colors">Estofados</Link>
          <Link href="/sobre" className="text-ink/80 hover:text-clay transition-colors">Sobre</Link>
          <Link href="/contato" className="text-ink/80 hover:text-clay transition-colors">Contato</Link>
        </nav>

        <div className="flex items-center gap-5 text-sm tracking-wide">
          <Link
            href={session?.user ? "/conta" : "/conta/entrar"}
            className="flex items-center gap-1.5 text-ink/80 hover:text-clay transition-colors"
          >
            <User className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">{session?.user ? "Minha conta" : "Entrar"}</span>
          </Link>
          <Link
            href="/carrinho"
            className="flex items-center gap-1.5 text-ink/80 hover:text-clay transition-colors"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Carrinho{cartCount > 0 ? ` (${cartCount})` : ""}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
