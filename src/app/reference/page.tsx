import type { Metadata } from "next";
import Link from "next/link";
import { acquisitions, naming, namingNote } from "@/data/reference";

export const metadata: Metadata = { title: "Naming & M&A · Salesforce Suite Explorer" };

export default function ReferencePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-6 sm:px-6 lg:grid-cols-2">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">Naming decoder</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{namingNote}</p>
          <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
            {naming.map((n) => (
              <li key={n.old} className="flex flex-wrap items-baseline gap-x-2 px-4 py-2.5 text-sm">
                <span className="text-slate-500 line-through decoration-slate-300">{n.old}</span>
                <span className="text-slate-400">→</span>
                <Link href={`/?focus=${n.productId}`} className="font-semibold hover:underline">
                  {n.current}
                </Link>
                {n.note && <span className="ml-auto text-[11px] text-slate-400">{n.note}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Search works with old names too: press <kbd className="rounded border px-1">⌘K</kbd> and type “Data Cloud”.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Acquisitions</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Acquired products usually keep their own stack, which is why so much of the suite is off core.
          </p>
          <ol className="relative mt-4 border-l-2 border-slate-200 pl-5 dark:border-slate-800">
            {acquisitions.map((a) => (
              <li key={a.company} className="mb-5 last:mb-0">
                <span className={`absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full ${a.company === "Contentful" ? "bg-yellow-400 ring-4 ring-yellow-100 dark:ring-yellow-900" : "bg-slate-400"}`} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{a.date}</div>
                <div className="font-semibold">
                  {a.productId ? (
                    <Link href={`/?focus=${a.productId}`} className="hover:underline">
                      {a.company}
                    </Link>
                  ) : (
                    a.company
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{a.foldsInto}</div>
                <div className="text-xs text-slate-500">{a.status}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
