"use client";

import { useEffect, useState, type MouseEvent } from "react";
import HomePageRenderer from "@/components/sections/HomePageRenderer";
import type { CmsPage } from "@/services/pageService";

export default function HomePreviewPage() {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [selected, setSelected] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => setEditing(new URLSearchParams(window.location.search).has("edit")), []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "cms-preview-scroll") {
        const section = Array.from(document.querySelectorAll<HTMLElement>("[data-cms-section]")).find((item) => item.dataset.cmsSection === event.data.section);
        if (section) setSelected(event.data.section);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (event.data?.type === "cms-preview-page") {
        const next = event.data.page as CmsPage;
        if (next?.slug === "home" && Array.isArray(next.blocks)) setPage(next);
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "cms-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  const select = (event: MouseEvent<HTMLDivElement>) => {
    if (!editing) return;
    const target = event.target instanceof Element ? event.target : null;
    const field = target?.closest<HTMLElement>("[data-cms-field]");
    const section = target?.closest<HTMLElement>("[data-cms-section]");
    const block = target?.closest<HTMLElement>("[data-cms-block-id]");
    if (!section && !block) return;
    event.preventDefault();
    event.stopPropagation();
    const sectionId = section?.dataset.cmsSection || "";
    setSelected(sectionId || block?.dataset.cmsBlockId || "");
    window.parent.postMessage({ type: "cms-preview-select", section: sectionId, field: field?.dataset.cmsField, blockId: block?.dataset.cmsBlockId }, window.location.origin);
  };

  return page ? <div className={editing ? "cms-preview-editing" : ""} onClickCapture={select} data-selected-section={selected}><HomePageRenderer preview={page} /></div> : <div className="grid min-h-screen place-items-center bg-[#1c1d20] text-sm text-white/70">正在準備首頁預覽…</div>;
}
