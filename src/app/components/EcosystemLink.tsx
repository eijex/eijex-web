"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

export default function EcosystemLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    if (window.location.hash !== "#ecosystem") {
      window.history.pushState(null, "", "#ecosystem");
    }
    document.getElementById("ecosystem")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Link href="/#ecosystem" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
