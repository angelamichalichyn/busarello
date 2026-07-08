"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div data-theme="admin" className="min-h-screen flex items-center justify-center bg-black text-zinc-100 p-8">
      <div className="admin-card p-8 max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h1 className="text-lg font-semibold text-white mb-2">Algo deu errado</h1>
        <p className="text-sm text-zinc-400 mb-6">{error.message || "Erro inesperado."}</p>
        <button onClick={reset} className="admin-btn-primary">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
