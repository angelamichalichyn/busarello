import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-[200px_1fr] gap-10">
        <nav className="space-y-6 text-sm">
          <Image
            src="/brand/logo-wordmark.png"
            alt="Busarello Estofados"
            width={160}
            height={50}
            className="h-9 w-auto"
          />
          <div className="space-y-1">
            <Link className="block rounded-sm px-2 py-1.5 text-ink/80 hover:bg-sand-light hover:text-pine" href="/admin">Dashboard</Link>
            <Link className="block rounded-sm px-2 py-1.5 text-ink/80 hover:bg-sand-light hover:text-pine" href="/admin/produtos">Produtos</Link>
            <Link className="block rounded-sm px-2 py-1.5 text-ink/80 hover:bg-sand-light hover:text-pine" href="/admin/pedidos">Pedidos</Link>
            <Link className="block rounded-sm px-2 py-1.5 text-ink/80 hover:bg-sand-light hover:text-pine" href="/admin/configuracoes">Configurações</Link>
          </div>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
