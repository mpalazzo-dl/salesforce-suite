import { groupRows, groupById } from "@/data/groups";
import { products } from "@/data/products";
import type { GroupId } from "@/data/types";

export const NODE_W = 196;
export const NODE_H = 62;
const GAP = 14;
const PAD = 18;
const HEADER = 52;
const COLLAPSED_W = 240;
const COLLAPSED_H = 104;
const GROUP_GAP_X = 90;
const GROUP_GAP_Y = 110;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layout {
  groups: Record<GroupId, Box>;
  /** Product positions relative to their group box. */
  products: Record<string, { x: number; y: number }>;
}

export const productsInGroup = (g: GroupId) => products.filter((p) => p.group === g);

/** Deterministic architecture layout: apps on top, platform in the middle, supporting products below. */
export function computeLayout(collapsed: GroupId[]): Layout {
  const sizes = {} as Record<GroupId, { w: number; h: number }>;
  const out: Layout = { groups: {} as Layout["groups"], products: {} };

  for (const row of groupRows) {
    for (const g of row) {
      const items = productsInGroup(g);
      if (collapsed.includes(g)) {
        sizes[g] = { w: COLLAPSED_W, h: COLLAPSED_H };
        continue;
      }
      const cols = Math.min(groupById[g].cols, items.length);
      const rows = Math.ceil(items.length / cols);
      sizes[g] = {
        w: PAD * 2 + cols * NODE_W + (cols - 1) * GAP,
        h: HEADER + PAD + rows * NODE_H + (rows - 1) * GAP,
      };
      items.forEach((p, i) => {
        out.products[p.id] = {
          x: PAD + (i % cols) * (NODE_W + GAP),
          y: HEADER + Math.floor(i / cols) * (NODE_H + GAP),
        };
      });
    }
  }

  const rowWidths = groupRows.map((row) => row.reduce((w, g) => w + sizes[g].w, 0) + (row.length - 1) * GROUP_GAP_X);
  const maxW = Math.max(...rowWidths);
  let y = 0;
  groupRows.forEach((row, ri) => {
    let x = (maxW - rowWidths[ri]) / 2;
    const rowH = Math.max(...row.map((g) => sizes[g].h));
    for (const g of row) {
      // Vertically center shorter groups in their row so edges stay short.
      out.groups[g] = { x, y: y + (rowH - sizes[g].h) / 2, ...sizes[g] };
      x += sizes[g].w + GROUP_GAP_X;
    }
    y += rowH + GROUP_GAP_Y;
  });
  return out;
}
