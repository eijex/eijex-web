"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavActiveLinkProps = {
  href: string;
  children: ReactNode;
  mobile?: boolean;
};

export default function NavActiveLink({ href, children, mobile = false }: NavActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
          isActive ? "font-semibold text-teal-700 dark:text-teal-400" : ""
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
        isActive ? "font-semibold text-teal-700 dark:text-teal-400" : ""
      }`}
    >
      {children}
    </Link>
  );
}
