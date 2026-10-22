"use client";

import { ChevronLeft, ChevronRight, Pause, Pencil, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { productById } from "@/data/products";
import { cx } from "@/lib/format";
import { findProject, useUI } from "@/store/ui";
import { SectionTitle } from "../ui";

export function ProjectPanel({ onEdit }: { onEdit: (id: string) => void }) {
  const { projectId, stepIndex, setStep, openProject, select, userProjects } = useUI();
  const project = findProject(projectId, userProjects);
  // Remember which project is playing, so switching projects or reaching the last step stops playback.
  const [playingId, setPlayingId] = useState<string | null>(null);
  const steps = project?.steps ?? [];
  const playing = playingId === projectId && stepIndex < steps.length - 1;
  const setPlaying = (on: boolean) => setPlayingId(on ? projectId : null);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep(stepIndex + 1), 3500);
    return () => clearTimeout(t);
  }, [playing, stepIndex, setStep]);

  if (!project) return null;
  const step = steps[stepIndex];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <span className="mr-auto text-[11px] font-semibold uppercase tracking-wider text-amber-600">Project</span>
        {project.userCreated && (
          <button aria-label="Edit project" onClick={() => onEdit(project.id)} className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Pencil size={14} />
          </button>
        )}
        <button aria-label="Close project" onClick={() => openProject(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{project.name}</h2>
          {project.customers && <p className="text-xs text-slate-500">Accounts: {project.customers}</p>}
          <p className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{project.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.products.map((id) => (
              <button key={id} onClick={() => select(id)} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                {productById[id]?.shortName ?? id}
              </button>
            ))}
          </div>
        </div>

        {steps.length > 0 && (
          <div>
            <SectionTitle
              right={
                <div className="flex items-center gap-1">
                  <button aria-label="Previous step" disabled={stepIndex === 0} onClick={() => setStep(stepIndex - 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
                    onClick={() => {
                      if (!playing && stepIndex >= steps.length - 1) setStep(0);
                      setPlaying(!playing);
                    }}
                    className="rounded bg-amber-400 p-1 text-amber-950 hover:bg-amber-300"
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button aria-label="Next step" disabled={stepIndex >= steps.length - 1} onClick={() => setStep(stepIndex + 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">
                    <ChevronRight size={14} />
                  </button>
                </div>
              }
            >
              Walkthrough · {stepIndex + 1}/{steps.length}
            </SectionTitle>
            <ol className="space-y-1.5">
              {steps.map((st, i) => (
                <li key={i}>
                  <button
                    onClick={() => setStep(i)}
                    className={cx(
                      "w-full rounded-lg border p-2.5 text-left transition-colors",
                      i === stepIndex
                        ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-bold text-amber-600">{i + 1}</span>
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{st.title}</span>
                    </div>
                    {(i === stepIndex || !step) && <p className="mt-1 pl-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{st.body}</p>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        {project.talkTrack.length > 0 && (
          <div>
            <SectionTitle>Talk track</SectionTitle>
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-slate-700 dark:text-slate-300">
              {project.talkTrack.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
