"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUI } from "@/store/ui";
import { cx } from "@/lib/format";
import { CommandPalette, useCommandPalette } from "./CommandPalette";

const nav = [
  { href: "/", label: "Suite Map" },
  { href: "/catalog", label: "Index & Search" },
  { href: "/layers", label: "Layers" },
  { href: "/reference", label: "Naming & M&A" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useCommandPalette();
  useEffect(() => {
    useUI.persist.rehydrate();
  }, []);
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#032d60] text-[11px] font-bold text-white">SF</span>
        <span className="hidden text-sm font-semibold tracking-tight sm:block">
          Suite Explorer <span className="font-normal text-slate-400">for Contentful SEs</span>
        </span>
      </Link>
      <nav className="ml-2 flex items-center gap-0.5 overflow-x-auto">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cx(
              "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm",
              pathname === n.href
                ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => setOpen(true)}
        className="ml-auto flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-500 hover:border-slate-400 dark:border-slate-700"
      >
        <Search size={14} />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded bg-slate-100 px-1 text-[10px] md:inline dark:bg-slate-800">⌘K</kbd>
      </button>
      <CommandPalette open={open} setOpen={setOpen} />
    </header>
  );
}
