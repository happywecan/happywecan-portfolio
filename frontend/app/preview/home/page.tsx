"use client";

import { useEffect, useState } from "react";
import HomePageRenderer from "@/components/sections/HomePageRenderer";
import type { CmsPage } from "@/services/pageService";

export default function HomePreviewPage() {
  const [page, setPage] = useState<CmsPage | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "cms-preview-page") return;
      const next = event.data.page as CmsPage;
      if (next?.slug === "home" && Array.isArray(next.blocks)) setPage(next);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "cms-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  return page ? <HomePageRenderer preview={page} /> : <div className="grid min-h-screen place-items-center bg-[#1c1d20] text-sm text-white/70">正在準備首頁預覽…</div>;
}
