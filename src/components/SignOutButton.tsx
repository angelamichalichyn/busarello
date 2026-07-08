"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

export function SignOutButton({
  icon,
  label = "Sair da conta",
  className = "btn-ghost inline-flex items-center gap-2 text-red-600 hover:text-red-700",
  callbackUrl = "/",
}: {
  icon?: ReactNode;
  label?: string;
  className?: string;
  callbackUrl?: string;
}) {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl })} className={className}>
      {icon}
      {label}
    </button>
  );
}
