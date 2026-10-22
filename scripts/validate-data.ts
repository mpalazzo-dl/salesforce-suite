import { z } from "zod";
import { products } from "../src/data/products";
import { groups } from "../src/data/groups";
import { relationships, edgeKinds } from "../src/data/relationships";
import { tags } from "../src/data/tags";
import { seedProjects } from "../src/data/projects";
import { naming, acquisitions, surfaces, layers } from "../src/data/reference";
import { overviews } from "../src/data/overviews";
import { productParts } from "../src/data/components";

const productIds = new Set(products.map((p) => p.id));
const groupIds = groups.map((g) => g.id) as [string, ...string[]];
const tagIds = tags.map((t) => t.id) as [string, ...string[]];
const kindIds = edgeKinds.map((k) => k.id) as [string, ...string[]];
const edgeIds = new Set(relationships.map((r) => r.id));
const productId = z.string().refine((id) => productIds.has(id), { error: (iss) => `unknown product "${String(iss.input)}"` });

const Product = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  group: z.enum(groupIds),
  tags: z.array(z.enum(tagIds)),
  contentfulFit: z.object({ level: z.enum(["self", "direct", "high", "medium", "low", "none"]), pattern: z.string().min(1) }),
});
const Edge = z.object({ from: productId, to: productId, kind: z.enum(kindIds) });
const Project = z.object({
  id: z.string(),
  products: z.array(productId),
  steps: z.array(
    z.object({
      edge: z.string().refine((e) => edgeIds.has(e), { error: (iss) => `unknown edge "${String(iss.input)}"` }).optional(),
      node: productId.optional(),
    }),
  ),
});

const errors: string[] = [];
const check = (label: string, schema: z.ZodType, items: unknown[]) =>
  items.forEach((item, i) => {
    const r = schema.safeParse(item);
    if (!r.success) errors.push(`${label}[${i}] ${JSON.stringify((item as { id?: string }).id ?? "")}: ${r.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`);
  });

check("products", Product, products);
check("relationships", Edge, relationships);
check("projects", Project, seedProjects);
check("naming", z.object({ productId }), naming);
check("acquisitions", z.object({ productId: productId.optional() }), acquisitions);
check("surfaces", z.object({ productIds: z.array(productId) }), surfaces);
check("layers", z.object({ productId: productId.optional() }), layers);

const dupe = (ids: string[], label: string) =>
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => errors.push(`duplicate ${label} "${id}"`));
dupe(products.map((p) => p.id), "product");
dupe(relationships.map((r) => [r.from, r.to].sort().join("|")), "edge pair");
seedProjects.forEach((p) =>
  p.steps.forEach((s) => {
    const r = s.edge && relationships.find((e) => e.id === s.edge);
    if (r && (!p.products.includes(r.from) || !p.products.includes(r.to)))
      errors.push(`project ${p.id}: step edge ${s.edge} touches a product outside the project`);
  }),
);

products.forEach((p) => {
  if (!overviews[p.id]) errors.push(`product ${p.id} has no overview`);
  if (!productParts[p.id]) errors.push(`product ${p.id} has no parts list`);
});
[...Object.keys(overviews), ...Object.keys(productParts)].forEach((id) => {
  if (!productIds.has(id)) errors.push(`overview/parts key "${id}" is not a product`);
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok: ${products.length} products, ${relationships.length} relationships, ${seedProjects.length} projects`);
