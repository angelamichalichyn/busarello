"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

export function SignOutButton({ icon }: { icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-ghost inline-flex items-center gap-2 text-red-600 hover:text-red-700"
    >
      {icon}
      Sair da conta
    </button>
  );
}
