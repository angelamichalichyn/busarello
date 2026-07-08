"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⚠️</span>
      </div>
      <h1 className="font-serif text-3xl text-pine mb-4">Algo deu errado</h1>
      <p className="text-ink/60 mb-8">
        Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
        <Link href="/" className="btn-outline inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
