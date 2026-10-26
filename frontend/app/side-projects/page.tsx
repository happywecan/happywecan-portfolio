import type { Metadata } from "next";
import Link from "next/link";
import type { PortfolioItem } from "@/types/api";
import { projectDescription } from "@/features/landing/projectCopy";

export const metadata: Metadata = {
  title: "Side Projects",
  description: "Angelo Lo 的個人專案與實驗作品。",
};

async function getProjects(): Promise<PortfolioItem[] | null> {
  const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  try {
    const response = await fetch(`${apiBase}/api/portfolio`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json() as PortfolioItem[];
  } catch {
    return null;
  }
}

export default async function SideProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="min-h-screen bg-[#f3f4f1] px-5 pb-28 pt-32 text-[#202421] md:px-10 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <Link href="/#portfolio" className="text-xs font-semibold uppercase tracking-[.16em] text-[#5c6d5d] underline-offset-4 hover:underline">← 回到工作經驗</Link>
        <div className="mt-14 border-t border-[#cdd5cc] pt-6">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#628366]">Personal work</p>
          <h1 className="mt-5 text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-none tracking-[-.07em]">Side Projects<span className="text-[#6b8d6f]">.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#607064] md:text-lg">工作以外，我用專案練習設計、開發與驗證想法。這裡只收錄能公開展示的個人作品。</p>
        </div>

        {projects === null ? (
          <p className="mt-16 rounded-2xl border border-[#d8dfd7] bg-white p-8 text-[#627064]">目前無法載入專案，請稍後再試。</p>
        ) : projects.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-[#d8dfd7] bg-white p-8 text-[#627064]">個人專案整理中。</p>
        ) : (
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <Link key={project.id} href={`/portfolio/${project.id}`} className="group flex min-h-80 flex-col overflow-hidden rounded-[24px] border border-[#d8dfd7] bg-white p-7 transition-transform hover:-translate-y-1 hover:shadow-[0_18px_45px_-30px_rgba(24,32,26,.35)] md:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[.14em] text-[#6c8570]">Project / {String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="text-2xl text-[#6c8570] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
                <div className="mt-auto pt-16">
                  <h2 className="text-3xl font-semibold leading-tight tracking-[-.05em] md:text-4xl">{project.title}</h2>
                  {project.description && <p className="mt-4 max-w-lg text-sm leading-7 text-[#667168]">{projectDescription(project.title, project.description)}</p>}
                  {project.tags?.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-[#edf2ea] px-3 py-1.5 text-xs font-medium text-[#416442]">{tag}</span>)}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
