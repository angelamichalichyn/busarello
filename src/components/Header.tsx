import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCartItemCount } from "@/lib/cart";

export async function Header() {
  const [session, cartCount] = await Promise.all([auth(), getCartItemCount()]);

  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Busarello Estofados
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/colchoes" className="hover:underline">Colchões</Link>
          <Link href="/estofados" className="hover:underline">Estofados</Link>
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <Link href={session?.user ? "/conta" : "/conta/entrar"} className="hover:underline">
            {session?.user ? "Minha conta" : "Entrar"}
          </Link>
          <Link href="/carrinho" className="hover:underline">
            Carrinho{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
