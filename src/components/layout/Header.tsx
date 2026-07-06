import Link from "next/link";

import { Nav } from "./Nav";

// Sticky top bar shared by every route. Server component — the interactive
// active-state logic lives in <Nav /> (client). Text-only "ACP-SEC" logo; a
// real logo image can be added later (per the 3.4 decision).
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-page py-3">
        <Link
          href="/"
          className="text-title font-bold tracking-tight text-fg hover:text-primary"
        >
          ACP-SEC
        </Link>
        <Nav />
      </div>
    </header>
  );
}
