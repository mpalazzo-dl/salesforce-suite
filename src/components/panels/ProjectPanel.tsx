"use client";

import { ChevronLeft, ChevronRight, Pause, Pencil, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { groupById } from "@/data/groups";
import { productById } from "@/data/products";
import { cx } from "@/lib/format";
import { findProject, useActiveProject, useUI } from "@/store/ui";
import { CollapsibleSection, Pill, StackBadge, SwitchTrack } from "../ui";

export function ProjectPanel({ onEdit }: { onEdit: (id: string) => void }) {
  const { projectId, stepIndex, setStep, openProject, select, userProjects, excludedProducts, toggleExcluded } = useUI();
  const full = findProject(projectId, userProjects);
  // Steps follow the trimmed stack; the products list keeps every product so it can be toggled back.
  const project = useActiveProject();
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

  if (!project || !full) return null;
  const step = steps[stepIndex];
  const hiddenSteps = full.steps.length - steps.length;

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
          {project.stack && (
            <div className="mt-1">
              <StackBadge stack={project.stack} />
            </div>
          )}
          {project.customers && <p className="text-xs text-slate-500">Accounts: {project.customers}</p>}
          <p className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{project.summary}</p>
        </div>

        {full.steps.length > 0 && (
          <CollapsibleSection
            title={steps.length ? `Walkthrough · ${stepIndex + 1}/${steps.length}` : "Walkthrough"}
            right={
              steps.length > 0 && (
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
              )
            }
          >
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
            {hiddenSteps > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                {hiddenSteps} {hiddenSteps === 1 ? "step is" : "steps are"} hidden because {excludedProducts.length === 1 ? "a product is" : "products are"} toggled out of the stack.
              </p>
            )}
          </CollapsibleSection>
        )}

        <CollapsibleSection
          defaultOpen={false}
          title={`Products · ${project.products.length}${excludedProducts.length ? ` of ${full.products.length}` : ""}`}
          right={
            excludedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => excludedProducts.forEach(toggleExcluded)}
                className="rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Include all
              </button>
            )
          }
        >
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
            {full.products.map((id) => {
              const p = productById[id];
              const on = !excludedProducts.includes(id);
              return (
                <li key={id} className="flex items-center gap-2 px-3 py-1.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${on ? "Remove" : "Add"} ${p?.name ?? id} ${on ? "from" : "to"} the stack`}
                    onClick={() => toggleExcluded(id)}
                  >
                    <SwitchTrack on={on} />
                  </button>
                  <button
                    type="button"
                    onClick={() => select(id)}
                    title="Open product details"
                    className={cx("flex min-w-0 flex-1 items-center gap-2 text-left hover:underline", !on && "opacity-45")}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: p ? groupById[p.group].color : undefined }} />
                    <span className={cx("truncate text-[13px] font-medium text-slate-900 dark:text-slate-100", !on && "line-through")}>{p?.name ?? id}</span>
                    {p && <span className="ml-auto shrink-0 text-right text-[11px] text-slate-500">{p.category}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </CollapsibleSection>

        {project.talkTrack.length > 0 && (
          <CollapsibleSection title="Talk track">
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-slate-700 dark:text-slate-300">
              {project.talkTrack.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {!!project.caveats?.length && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
            <CollapsibleSection title="When it's not a fit">
              <ul className="list-disc space-y-1 pl-4 text-[13px] text-amber-950 dark:text-amber-100">
                {project.caveats.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>
        )}

        {!!project.clientNeeds?.length && (
          <CollapsibleSection title="What else the client needs">
            <ul className="space-y-2">
              {project.clientNeeds.map((n, i) => (
                <li key={i} className="text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{n.need}</span>
                    {n.coveredBy ? (
                      <Pill className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Covered by {n.coveredBy}</Pill>
                    ) : (
                      <Pill className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Client brings</Pill>
                    )}
                  </div>
                  {n.note && <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{n.note}</p>}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
