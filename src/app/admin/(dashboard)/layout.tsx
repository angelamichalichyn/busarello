import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { AdminNav } from "@/components/admin/AdminNav";

// O admin sempre mostra dados ao vivo do banco; nunca deve ser
// otimizado como página estática no build.
// A autenticação/autorização já é garantida por src/proxy.ts (matcher /admin/:path*).
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="admin" className="min-h-screen flex bg-cream text-ink">
      <aside className="w-60 shrink-0 border-r border-sand-light bg-paper flex flex-col justify-between p-5">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <Link
            href="/"
            target="_blank"
            className="text-ink/50 text-xs inline-flex items-center gap-1 hover:text-clay transition-colors mb-8"
          >
            Busarello Estofados
            <ExternalLink className="w-3 h-3" />
          </Link>

          <AdminNav />
        </div>

        <SignOutButton
          icon={<LogOut className="w-4 h-4" />}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink/60 hover:bg-sand-light hover:text-ink transition-colors"
        />
      </aside>

      <div className="flex-1 p-8 overflow-x-auto">{children}</div>
    </div>
  );
}
