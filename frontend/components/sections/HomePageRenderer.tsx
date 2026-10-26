"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import ContactSection from "./ContactSection";
import EditorialLanding from "./EditorialLanding";
import { LandingHero } from "@/features/landing/LandingHero";
import { PositioningSection } from "@/features/landing/PositioningSection";
import { WorkShowcase } from "@/features/landing/WorkShowcase";
import { NotesSection } from "@/features/landing/NotesSection";
import { experienceTitle } from "@/features/landing/landingContent";
import { useLandingSettings } from "@/features/landing/useLandingSettings";
import type { HeroSettings, SiteSettings } from "@/services/staticContentService";
import { getPage, type CmsPage, type PageBlock } from "@/services/pageService";

const fallback: CmsPage = {
  slug: "home",
  title: "首頁",
  version: 0,
  blocks: [{ id: "editorial-default", type: "editorial", enabled: true, content: {} }],
};

const text = (block: PageBlock, key: string, defaultValue = "") =>
  typeof block.content[key] === "string" ? String(block.content[key]) : defaultValue;

function safeHref(value: string) {
  return /^(https?:\/\/|mailto:|\/|#)/.test(value) ? value : "#";
}

function renderBlock(block: PageBlock, hero: HeroSettings | null, site: SiteSettings | null) {
  const portfolioTitle = experienceTitle(site?.portfolio_title);
  const blogTitle = site?.blog_title?.trim() || "Notes from the work";
  switch (block.type) {
    case "editorial": return <EditorialLanding hero={hero} site={site} copy={block.content} />;
    case "hero": return <LandingHero settings={hero} />;
    case "about": return <PositioningSection settings={hero} />;
    case "skills": return <WorkShowcase mode="skills" portfolioTitle={portfolioTitle} />;
    case "portfolio": return <WorkShowcase mode="portfolio" portfolioTitle={portfolioTitle} />;
    case "blog": return <NotesSection title={blogTitle} />;
    case "contact": return <ContactSection />;
    case "rich_text":
      return <section className="bg-[#f1f0ea] px-6 py-20 text-zinc-900 md:px-10"><div className="mx-auto max-w-4xl"><p className="font-mono text-xs uppercase tracking-[.2em] text-zinc-500">{text(block, "eyebrow")}</p><h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{text(block, "title", "內容標題")}</h2><div className="prose prose-zinc mt-8 max-w-none text-zinc-600"><ReactMarkdown>{text(block, "body")}</ReactMarkdown></div></div></section>;
    case "image_text": {
      const imageRight = text(block, "image_side", "left") === "right";
      return <section className="bg-white px-6 py-20 md:px-10"><div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2"><div className={imageRight ? "md:order-2" : ""}>{text(block, "image_url") ? <Image src={text(block, "image_url")} alt={text(block, "image_alt")} width={1200} height={900} className="aspect-[4/3] w-full rounded-2xl object-cover" /> : <div className="aspect-[4/3] rounded-2xl bg-zinc-100" />}</div><div><p className="font-mono text-xs uppercase tracking-[.2em] text-zinc-500">{text(block, "eyebrow")}</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">{text(block, "title", "圖文內容")}</h2><div className="prose prose-zinc mt-6"><ReactMarkdown>{text(block, "body")}</ReactMarkdown></div></div></div></section>;
    }
    case "cta":
      return <section className="bg-[#455ce9] px-6 py-20 text-white md:px-10"><div className="mx-auto max-w-5xl text-center"><h2 className="text-4xl font-semibold tracking-tight md:text-6xl">{text(block, "title", "準備好開始了嗎？")}</h2><p className="mx-auto mt-5 max-w-2xl text-white/75">{text(block, "body")}</p><a href={safeHref(text(block, "button_url", "#contact"))} className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-zinc-950">{text(block, "button_label", "聯絡我")}</a></div></section>;
    case "spacer": {
      const sizes = { small: "h-8", medium: "h-16", large: "h-28" };
      const size = text(block, "size", "medium") as keyof typeof sizes;
      return <div aria-hidden="true" className={sizes[size] || sizes.medium} />;
    }
  }
}

export default function HomePageRenderer({ preview, initialPage, initialHero = null }: { preview?: CmsPage; initialPage?: CmsPage; initialHero?: HeroSettings | null }) {
  const [page, setPage] = useState<CmsPage>(initialPage || fallback);
  const { hero, site } = useLandingSettings(initialHero);
  useEffect(() => { if (!preview && !initialPage) void getPage("home").then(setPage).catch(() => setPage(fallback)); }, [preview, initialPage]);
  useEffect(() => { if (!preview && !window.location.hash) { window.history.scrollRestoration = "manual"; requestAnimationFrame(() => window.scrollTo(0, 0)); } }, [preview]);
  const current = preview || page;
  const blocks = current.blocks.filter((block) => block.enabled);
  return <>{(blocks.length ? blocks : fallback.blocks).map((block) => <div key={block.id} data-cms-block-id={block.id}>{renderBlock(block, hero, site)}</div>)}</>;
}
