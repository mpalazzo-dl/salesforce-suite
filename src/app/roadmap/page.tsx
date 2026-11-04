import type { Metadata } from "next";
import { RoadmapBoard } from "@/components/RoadmapBoard";
import { roadmapAsOf } from "@/data/roadmap";

export const metadata: Metadata = { title: "Contentful roadmap · Salesforce Suite Explorer" };

export default function RoadmapPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Contentful integration roadmap</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          What connects Contentful to the Salesforce suite today and what is coming, as of {roadmapAsOf}.
        </p>
        <div
          role="note"
          className="mt-4 max-w-3xl rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <strong className="font-semibold">Subject to change.</strong> This is not the definitive roadmap. It tracks what we are
          hearing from Product so the field has one place to look. For more information and definitive timelines, contact the
          Product team.
        </div>
        <RoadmapBoard />
      </div>
    </div>
  );
}
