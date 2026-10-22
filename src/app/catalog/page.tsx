import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = { title: "Index & Search · Salesforce Suite Explorer" };

async function Catalog({ searchParams }: { searchParams: PageProps<"/catalog">["searchParams"] }) {
  const { q } = await searchParams;
  return <CatalogView initialQuery={typeof q === "string" ? q : ""} />;
}

export default function CatalogPage({ searchParams }: PageProps<"/catalog">) {
  return (
    <div className="flex-1 overflow-y-auto">
      <Suspense fallback={<CatalogView />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
