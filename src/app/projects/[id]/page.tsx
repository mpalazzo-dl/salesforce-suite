import { redirect } from "next/navigation";
import { seedProjects } from "@/data/projects";

export function generateStaticParams() {
  return seedProjects.map((p) => ({ id: p.id }));
}

// Deep link for a project walkthrough; the map reads ?project= and opens it.
export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  redirect(`/?project=${encodeURIComponent(id)}`);
}
