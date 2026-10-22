"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useRef } from "react";
import { groupById, groups } from "@/data/groups";
import { productById } from "@/data/products";
import { edgeKindById } from "@/data/relationships";
import type { GroupId } from "@/data/types";
import { findProject, useUI } from "@/store/ui";
import { CloudNode, type CloudNodeType } from "./CloudNode";
import { FloatingEdge, type EdgeState, type FloatingEdgeType } from "./FloatingEdge";
import { matchesTags, neighborhood, projectFocus, seedsFor, visibleRelationships, type Focus } from "./focus";
import { computeLayout, productsInGroup } from "./layout";
import { ProductNode, type NodeState, type ProductNodeType } from "./ProductNode";

const nodeTypes = { product: ProductNode, cloud: CloudNode };
const edgeTypes = { floating: FloatingEdge };

export function SuiteGraph() {
  const s = useUI();
  const { fitView } = useReactFlow();
  const project = findProject(s.projectId, s.userProjects);

  const layout = useMemo(() => computeLayout(s.collapsed), [s.collapsed]);
  const rels = useMemo(() => visibleRelationships(s.hiddenKinds, s.showInferred), [s.hiddenKinds, s.showInferred]);

  const focus: Focus | null = useMemo(() => {
    if (project) return projectFocus(project, rels, s.stepIndex);
    if (s.selectedId) return neighborhood(seedsFor(s.selectedId), rels, s.hops);
    return null;
  }, [project, rels, s.stepIndex, s.selectedId, s.hops]);

  const { nodes, edges } = useMemo(() => {
    const tagMatch = (id: string) => matchesTags(id, s.activeTags, s.tagMode);
    const hidden = (id: string) => s.hideNonMatching && !tagMatch(id);
    const repOf = (id: string) => {
      const g = productById[id].group;
      return s.collapsed.includes(g) ? `group:${g}` : id;
    };

    const nodeState = (id: string): NodeState => {
      if (!tagMatch(id)) return "dim";
      if (!focus) return "normal";
      if (focus.stepNodes?.has(id)) return "step";
      if (!focus.nodes.has(id)) return "dim";
      if (focus.distance.get(id) === 0) return "focus";
      return "neighbor";
    };

    const nodes: Node[] = [];
    for (const g of groups) {
      const box = layout.groups[g.id];
      const items = productsInGroup(g.id).filter((p) => !hidden(p.id));
      const collapsed = s.collapsed.includes(g.id);
      if (!items.length && s.hideNonMatching) continue;
      const anyLive = items.some((p) => nodeState(p.id) !== "dim");
      nodes.push({
        id: `group:${g.id}`,
        type: "cloud",
        position: { x: box.x, y: box.y },
        width: box.w,
        height: box.h,
        zIndex: 0,
        selectable: false,
        data: {
          group: g,
          count: items.length,
          collapsed,
          dim: !anyLive,
          selected: s.selectedId === `group:${g.id}`,
          names: items.map((p) => p.shortName),
        },
      } satisfies CloudNodeType);
      if (collapsed) continue;
      for (const p of items) {
        nodes.push({
          id: p.id,
          type: "product",
          parentId: `group:${g.id}`,
          position: layout.products[p.id],
          zIndex: 2,
          data: { product: p, state: nodeState(p.id) },
        } satisfies ProductNodeType);
      }
    }

    const live = new Set(nodes.map((n) => n.id));
    const merged = new Map<string, FloatingEdgeType>();
    for (const r of rels) {
      if (hidden(r.from) || hidden(r.to)) continue;
      const a = repOf(r.from);
      const b = repOf(r.to);
      if (a === b || !live.has(a) || !live.has(b)) continue;

      let state: EdgeState = "normal";
      if (!tagMatch(r.from) || !tagMatch(r.to)) state = "dim";
      else if (focus) state = focus.stepEdge === r.id ? "step" : focus.edges.has(r.id) ? "focus" : "dim";

      const key = `${a}->${b}`;
      const prev = merged.get(key);
      const kind = edgeKindById[r.kind];
      if (prev?.data) {
        const rank = (x: EdgeState) => ["dim", "normal", "focus", "step"].indexOf(x);
        prev.data.count += 1;
        if (!prev.data.kinds.includes(r.kind)) prev.data.kinds.push(r.kind);
        prev.data.label = `${prev.data.count} connections`;
        if (rank(state) > rank(prev.data.state)) prev.data.state = state;
        prev.data.inferred &&= r.confidence === "inferred";
        continue;
      }
      merged.set(key, {
        id: key,
        source: a,
        target: b,
        type: "floating",
        zIndex: state === "focus" || state === "step" ? 3 : 1,
        markerEnd: { type: MarkerType.ArrowClosed, color: kind.color, width: 16, height: 16 },
        data: {
          kinds: [r.kind],
          label: r.label,
          state,
          inferred: r.confidence === "inferred",
          roadmap: r.status === "roadmap",
          count: 1,
        },
      });
    }
    return { nodes, edges: [...merged.values()] as Edge[] };
  }, [layout, rels, focus, s.activeTags, s.tagMode, s.hideNonMatching, s.collapsed, s.selectedId]);

  // Re-frame when the layout changes shape (collapse/expand).
  const firstFit = useRef(true);
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.08, duration: firstFit.current ? 0 : 400 }), 30);
    firstFit.current = false;
    return () => clearTimeout(t);
  }, [s.collapsed, s.hideNonMatching, fitView]);

  // Pan to the focused neighborhood so a click from search or the drawer is visible.
  useEffect(() => {
    if (!focus) return;
    const ids = [...(focus.stepNodes?.size ? focus.stepNodes : focus.nodes)].map((id) =>
      s.collapsed.includes(productById[id]?.group as GroupId) ? `group:${productById[id].group}` : id,
    );
    const t = setTimeout(
      () => fitView({ nodes: ids.map((id) => ({ id })), padding: 0.25, duration: 500, maxZoom: 1.1 }),
      50,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      minZoom={0.15}
      maxZoom={2}
      colorMode="system"
      onNodeClick={(_, n) => {
        if (n.type === "product") s.select(s.selectedId === n.id ? null : n.id);
        else if (n.type === "cloud" && s.collapsed.includes(n.id.slice(6) as GroupId)) s.select(n.id);
      }}
      onNodeDoubleClick={(_, n) => {
        if (n.type === "cloud") s.toggleCollapsed(n.id.slice(6) as GroupId);
      }}
      onPaneClick={() => {
        if (s.selectedId) s.select(null);
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <Controls showInteractive={false} position="bottom-right" />
      <MiniMap
        pannable
        zoomable
        position="bottom-left"
        className="!hidden md:!block"
        nodeColor={(n) =>
          n.type === "cloud"
            ? `${groupById[(n.id.slice(6) as GroupId)].color}33`
            : groupById[productById[n.id]?.group ?? "platform"].color
        }
      />
    </ReactFlow>
  );
}
