import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata = { title: "Página não encontrada | Busarello Estofados" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-8xl text-sand mb-4">404</h1>
      <h2 className="font-serif text-2xl text-pine mb-4">Página não encontrada</h2>
      <p className="text-ink/60 mb-8">
        A página que você procura pode ter sido removida, renomeada ou está
        temporariamente indisponível.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Voltar ao início
        </Link>
        <Link href="/colchoes" className="btn-outline inline-flex items-center gap-2">
          <Search className="w-4 h-4" />
          Ver produtos
        </Link>
      </div>
    </div>
  );
}
