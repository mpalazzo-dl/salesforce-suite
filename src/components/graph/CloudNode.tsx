"use client";

import { Handle, Position, useStore, type Node, type NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";
import type { Group } from "@/data/types";
import { cx } from "@/lib/format";
import { useUI } from "@/store/ui";

export type CloudNodeData = {
  group: Group;
  count: number;
  collapsed: boolean;
  dim: boolean;
  selected: boolean;
  /** Short names of the products inside, shown when collapsed. */
  names: string[];
};
export type CloudNodeType = Node<CloudNodeData, "cloud">;

const handleStyle = { opacity: 0, top: "50%", left: "50%", width: 1, height: 1, border: 0 };

function CloudNodeImpl({ data, width, height }: NodeProps<CloudNodeType>) {
  const { group: g, count, collapsed, dim, selected, names } = data;
  const far = useStore((s) => s.transform[2] < 0.55);
  const toggleCollapsed = useUI((s) => s.toggleCollapsed);
  const select = useUI((s) => s.select);

  return (
    <div
      className={cx(
        "relative rounded-2xl border-2 transition-opacity duration-200",
        collapsed ? "cursor-pointer bg-white shadow-md dark:bg-slate-900" : "bg-white/40 dark:bg-slate-900/40",
        dim && "opacity-30",
        selected && "shadow-xl",
      )}
      style={{
        width,
        height,
        borderColor: g.color,
        backgroundImage: `linear-gradient(${g.color}14, ${g.color}08)`,
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={false} />
      <Handle type="source" position={Position.Top} style={handleStyle} isConnectable={false} />
      <div className="flex items-center gap-1.5 px-3 pt-2.5">
        <button
          className="nodrag rounded p-0.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={collapsed ? `Expand ${g.name}` : `Collapse ${g.name}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapsed(g.id);
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          className={cx(
            "nodrag truncate text-left font-semibold tracking-tight text-slate-800 hover:underline dark:text-slate-100",
            far ? "text-2xl" : "text-sm",
          )}
          onClick={(e) => {
            e.stopPropagation();
            select(`group:${g.id}`);
          }}
        >
          {g.name}
        </button>
        <span className="ml-auto rounded-full px-2 py-px text-[11px] font-medium text-white" style={{ background: g.color === "#ffda00" ? "#a38a00" : g.color }}>
          {count}
        </span>
      </div>
      {collapsed && (
        <div className="px-4 pt-1.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {names.join(" · ")}
        </div>
      )}
    </div>
  );
}

export const CloudNode = memo(CloudNodeImpl);
