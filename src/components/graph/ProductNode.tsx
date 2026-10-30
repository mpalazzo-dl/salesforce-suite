"use client";

import { Handle, Position, useStore, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { groupById } from "@/data/groups";
import type { Product } from "@/data/types";
import { coreMeta, cx, fitMeta } from "@/lib/format";

export type NodeState = "normal" | "focus" | "neighbor" | "step" | "dim";

export type ProductNodeData = { product: Product; state: NodeState };
export type ProductNodeType = Node<ProductNodeData, "product">;

const zoomedOut = (s: { transform: [number, number, number] }) => s.transform[2] < 0.55;

const handleStyle = { opacity: 0, top: "50%", left: "50%", width: 1, height: 1, border: 0 };

function ProductNodeImpl({ data }: NodeProps<ProductNodeType>) {
  const { product: p, state } = data;
  const far = useStore(zoomedOut);
  const isCf = p.contentfulFit.level === "self";
  const color = groupById[p.group].color;

  return (
    <div
      className={cx(
        "group relative flex h-[62px] w-[196px] cursor-pointer items-stretch overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 dark:bg-slate-900",
        isCf ? "border-yellow-400 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-950/40" : "border-slate-200 dark:border-slate-700",
        state === "focus" && "scale-105 shadow-lg ring-2 ring-offset-2 ring-offset-transparent",
        state === "step" && "scale-105 shadow-lg ring-4 ring-amber-400",
        state === "neighbor" && "shadow-md",
        state === "dim" && "opacity-20 saturate-0",
      )}
      style={state === "focus" ? ({ "--tw-ring-color": color } as React.CSSProperties) : undefined}
      title={`${p.name}\n${p.category} · ${coreMeta[p.onCore].label}`}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={false} />
      <Handle type="source" position={Position.Top} style={handleStyle} isConnectable={false} />
      <div className="w-1.5 shrink-0" style={{ background: color }} />
      {far ? (
        <div className="flex flex-1 items-center px-3 text-[17px] font-semibold leading-tight text-slate-900 dark:text-slate-100">
          {p.shortName}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-2.5">
          <div className="truncate text-[13px] font-semibold leading-tight text-slate-900 dark:text-slate-100">{p.shortName}</div>
          <div className="flex items-center gap-1">
            <span className={cx("rounded px-1.5 py-px text-[10px] font-medium", coreMeta[p.onCore].className)}>
              {coreMeta[p.onCore].short}
            </span>
            {p.contentfulFit.level !== "self" && (
              <span className={cx("rounded px-1.5 py-px text-[10px] font-medium", fitMeta[p.contentfulFit.level].className)}>
                {fitMeta[p.contentfulFit.level].label}
              </span>
            )}
            {isCf && (
              <span className="rounded bg-yellow-300 px-1.5 py-px text-[10px] font-semibold text-yellow-950">
                {p.id === "contentful" ? "System of record" : "Content layer"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const ProductNode = memo(ProductNodeImpl);
