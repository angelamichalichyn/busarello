import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-[200px_1fr] gap-8">
      <nav className="space-y-2 text-sm">
        <p className="font-semibold text-neutral-900 mb-4">Admin</p>
        <Link className="block hover:underline" href="/admin">Dashboard</Link>
        <Link className="block hover:underline" href="/admin/produtos">Produtos</Link>
        <Link className="block hover:underline" href="/admin/pedidos">Pedidos</Link>
        <Link className="block hover:underline" href="/admin/configuracoes">Configurações</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
