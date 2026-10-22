import { productParts } from "@/data/components";
import { groupById } from "@/data/groups";
import { overviews } from "@/data/overviews";
import { productById, products } from "@/data/products";
import { acquisitions, layers, naming, surfaces } from "@/data/reference";
import { edgeKindById, relationships } from "@/data/relationships";
import { tagById, tagsFor } from "@/data/tags";
import type { Product, Project, Relationship } from "@/data/types";

export type Hit =
  | { type: "product"; id: string; score: number; product: Product }
  | { type: "relationship"; id: string; score: number; rel: Relationship }
  | { type: "project"; id: string; score: number; project: Project }
  | { type: "reference"; id: string; score: number; title: string; body: string; section: string; productId?: string };

type Field = [text: string | undefined, weight: number];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Every term must appear in some field; score sums field weights, with a bonus for prefix matches. */
function score(fields: Field[], terms: string[]): number {
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const [text, w] of fields) {
      if (!text) continue;
      const t = norm(text);
      const i = t.indexOf(term);
      if (i < 0) continue;
      const atWord = i === 0 || /[\s(/·-]/.test(t[i - 1]);
      best = Math.max(best, w * (atWord ? 1.5 : 1) * (t === term ? 2 : 1));
    }
    if (!best) return 0;
    total += best;
  }
  return total;
}

export const productFields = (p: Product): Field[] => [
  [p.name, 10],
  [p.shortName, 9],
  [p.formerNames.join(" · "), 8],
  [p.id, 6],
  [p.category, 4],
  [groupById[p.group].name, 3],
  [p.origin, 3],
  [tagsFor(p).map((t) => tagById[t].label).join(" · "), 3],
  [p.contentfulFit.pattern, 2],
  [p.contentfulFit.overlap, 2],
  [p.frontend, 1.5],
  [p.dataStore, 1.5],
  [p.pricingNote, 1.5],
  [p.summary, 1],
  [productParts[p.id]?.map((x) => [x.name, ...(x.aka ?? [])].join(" · ")).join(" · "), 7],
  [overviews[p.id]?.keyConcepts.join(" · "), 4],
  [overviews[p.id]?.users.join(" · "), 2],
  [productParts[p.id]?.map((x) => x.what).join(" "), 1],
  [overviews[p.id] && [overviews[p.id].what, ...overviews[p.id].howUsed].join(" "), 1],
];

export function terms(query: string) {
  return norm(query).split(/\s+/).filter(Boolean);
}

export function searchProducts(query: string, pool: Product[] = products): { product: Product; score: number }[] {
  const ts = terms(query);
  if (!ts.length) return pool.map((product) => ({ product, score: 0 }));
  return pool
    .map((product) => ({ product, score: score(productFields(product), ts) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function searchAll(query: string, projects: Project[]): Hit[] {
  const ts = terms(query);
  if (!ts.length) return [];
  const hits: Hit[] = [];

  for (const { product, score: s } of searchProducts(query)) hits.push({ type: "product", id: product.id, score: s, product });

  for (const r of relationships) {
    const s = score(
      [
        [productById[r.from].name, 3],
        [productById[r.to].name, 3],
        [productById[r.from].formerNames.join(" "), 2],
        [productById[r.to].formerNames.join(" "), 2],
        [r.label, 4],
        [edgeKindById[r.kind].label, 2],
        [r.description, 1.5],
      ],
      ts,
    );
    if (s) hits.push({ type: "relationship", id: r.id, score: s * 0.6, rel: r });
  }

  for (const p of projects) {
    const s = score(
      [
        [p.name, 8],
        [p.customers, 6],
        [p.summary, 2],
        [p.products.map((id) => productById[id]?.name).join(" "), 1.5],
        [p.steps.map((x) => `${x.title} ${x.body}`).join(" "), 1],
        [p.talkTrack.join(" "), 1],
      ],
      ts,
    );
    if (s) hits.push({ type: "project", id: p.id, score: s * 0.8, project: p });
  }

  const ref = (section: string, id: string, title: string, body: string, fields: Field[], productId?: string) => {
    const s = score(fields, ts);
    if (s) hits.push({ type: "reference", id: `${section}:${id}`, score: s * 0.5, title, body, section, productId });
  };
  naming.forEach((n, i) =>
    ref("Naming", String(i), `${n.old} → ${n.current}`, n.note ?? "", [[n.old, 6], [n.current, 6], [n.note, 1]], n.productId),
  );
  surfaces.forEach((x, i) =>
    ref("Where Contentful plugs in", String(i), x.surface, `${x.pattern}. Overlap: ${x.overlap}`, [[x.surface, 5], [x.pattern, 2], [x.overlap, 2]], x.productIds[0]),
  );
  layers.forEach((l) => ref("Platform layers", l.id, l.name, l.why, [[l.name, 5], [l.what, 1.5], [l.workload, 1.5], [l.why, 2]], l.productId));
  acquisitions.forEach((a, i) =>
    ref("Acquisitions", String(i), `${a.company} (${a.date})`, `${a.foldsInto}. ${a.status}`, [[a.company, 6], [a.date, 3], [a.foldsInto, 2], [a.status, 1]], a.productId),
  );

  return hits.sort((a, b) => b.score - a.score);
}
