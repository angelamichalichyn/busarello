"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível criar sua conta");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      router.push("/conta/entrar");
      return;
    }

    router.push("/conta");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7 text-clay" />
        </div>
        <h1 className="font-serif text-3xl text-pine mb-2">Junte-se a nós</h1>
        <p className="text-ink/60">Crie sua conta para acompanhar seus pedidos</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-2" htmlFor="name">Nome completo</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-ink/60">
          Já tem conta?{" "}
          <Link href="/conta/entrar" className="text-clay font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
