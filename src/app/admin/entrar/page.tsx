"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, getSession } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("E-mail ou senha inválidos");
      return;
    }

    const session = await getSession();
    if (session?.user?.role !== "ADMIN") {
      await signOut({ redirect: false });
      setLoading(false);
      setError("Esta conta não tem acesso ao painel administrativo");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div data-theme="admin" className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-clay/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-clay" />
          </div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-pine">Busarello Estofados</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-ink" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn-primary w-full">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
