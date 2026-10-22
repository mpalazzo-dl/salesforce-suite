"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useInternalNode,
  type Edge,
  type EdgeProps,
  type InternalNode,
} from "@xyflow/react";
import { memo } from "react";
import { edgeKindById } from "@/data/relationships";
import type { EdgeKind } from "@/data/types";
import { cx } from "@/lib/format";

export type EdgeState = "normal" | "focus" | "step" | "dim";

export type FloatingEdgeData = {
  kinds: EdgeKind[];
  label: string;
  state: EdgeState;
  inferred: boolean;
  roadmap: boolean;
  /** Number of underlying relationships (more than 1 when groups are collapsed). */
  count: number;
};
export type FloatingEdgeType = Edge<FloatingEdgeData, "floating">;

function center(n: InternalNode) {
  const { x, y } = n.internals.positionAbsolute;
  return { x: x + (n.measured.width ?? 0) / 2, y: y + (n.measured.height ?? 0) / 2 };
}

/** Where the line between two node centers crosses `node`'s border. */
function intersection(node: InternalNode, other: InternalNode) {
  const w = (node.measured.width ?? 0) / 2;
  const h = (node.measured.height ?? 0) / 2;
  const c = center(node);
  const o = center(other);
  const xx1 = (o.x - c.x) / (2 * w) - (o.y - c.y) / (2 * h);
  const yy1 = (o.x - c.x) / (2 * w) + (o.y - c.y) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  return { x: w * (xx3 + yy3) + c.x, y: h * (-xx3 + yy3) + c.y };
}

function side(node: InternalNode, p: { x: number; y: number }): Position {
  const { x, y } = node.internals.positionAbsolute;
  const w = node.measured.width ?? 0;
  const h = node.measured.height ?? 0;
  if (p.x <= x + 1) return Position.Left;
  if (p.x >= x + w - 1) return Position.Right;
  if (p.y <= y + 1) return Position.Top;
  if (p.y >= y + h - 1) return Position.Bottom;
  return Position.Top;
}

function FloatingEdgeImpl({ id, source, target, data, markerEnd }: EdgeProps<FloatingEdgeType>) {
  const s = useInternalNode(source);
  const t = useInternalNode(target);
  if (!s || !t || !data) return null;

  const sp = intersection(s, t);
  const tp = intersection(t, s);
  const [path, labelX, labelY] = getBezierPath({
    sourceX: sp.x,
    sourceY: sp.y,
    sourcePosition: side(s, sp),
    targetX: tp.x,
    targetY: tp.y,
    targetPosition: side(t, tp),
  });

  const kind = edgeKindById[data.kinds[0]];
  const hot = data.state === "focus" || data.state === "step";
  const width = data.state === "step" ? 4 : hot ? 2.75 : data.count > 1 ? 1.5 + Math.min(data.count, 4) * 0.5 : 1.5;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        className={cx(hot && "sf-edge-flow")}
        style={{
          stroke: kind.color,
          strokeWidth: width,
          strokeDasharray: hot ? "8 6" : data.inferred ? "5 5" : data.roadmap ? "2 4" : undefined,
          opacity: data.state === "dim" ? 0.07 : hot ? 1 : 0.45,
          transition: "opacity 200ms, stroke-width 200ms",
        }}
        interactionWidth={14}
      />
      {hot && (
        <EdgeLabelRenderer>
          <div
            className={cx(
              "nodrag nopan pointer-events-none absolute rounded-md border bg-white px-1.5 py-0.5 text-[10px] font-medium shadow-sm dark:bg-slate-900",
              data.state === "step" && "text-[12px] ring-2 ring-amber-400",
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              borderColor: kind.color,
              color: "var(--foreground)",
              zIndex: 1000,
            }}
          >
            {data.label}
            {data.inferred && <span className="ml-1 text-slate-400">· inferred</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const FloatingEdge = memo(FloatingEdgeImpl);
