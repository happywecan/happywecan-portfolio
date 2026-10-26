import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, FileDown } from "lucide-react";
import type { HeroSettings } from "@/services/staticContentService";
import { editorialText, type EditorialCopy } from "./editorialCopy";
import { FALLBACK_PORTRAIT, landingPortraitUrl } from "./LandingHero";

export function PositioningSection({ copy, settings, integrated = false }: { copy?: EditorialCopy; settings?: HeroSettings | null; integrated?: boolean }) {
  const portraitUrl = landingPortraitUrl(settings ?? null, copy);
  return (
    <section id="about" data-cms-section="about" className={`bg-[#f3f4f1] px-5 pt-24 text-[#202421] md:px-10 md:pt-28 ${integrated ? "pb-0" : "pb-5"}`}>
      <div className="mx-auto max-w-[850px]">
        <div className={`border border-[#e0e3dd] bg-white px-6 py-7 md:px-11 md:py-10 ${integrated ? "rounded-t-[28px] border-b-0" : "rounded-[28px] shadow-[0_20px_60px_-40px_rgba(24,32,26,.28)]"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-[#727a73]">
            <span data-cms-field="about_section_label" className="uppercase tracking-[.16em]">{editorialText(copy, "about_section_label", "01 / About")}</span>
          </div>

          <div className="mt-9 flex items-center gap-4 md:mt-10">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#e9ede8] md:size-16">
              <Image src={portraitUrl} alt="Angelo Lo" fill sizes="64px" className={`object-cover ${portraitUrl === FALLBACK_PORTRAIT ? "[transform:scale(2.5)_translateY(29%)]" : ""}`} />
            </div>
            <div className="min-w-0">
              <p data-cms-field="about_eyebrow" className="text-lg font-semibold tracking-[-.03em] md:text-xl">{editorialText(copy, "about_eyebrow", "Angelo Lo")}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#747b75]">
                <span data-cms-field="about_role_label">{editorialText(copy, "about_role_label", "目前職務")}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span data-cms-field="about_role">{editorialText(copy, "about_role", "Digital Transformation Specialist")}</span>
              </p>
            </div>
          </div>

          <h2 data-cms-field="about_heading" style={{ textTransform: "none" }} className="mt-9 max-w-[710px] text-balance text-[clamp(1.85rem,4.1vw,3.5rem)] font-semibold leading-[1.24] tracking-[-.055em] md:mt-10">
            {editorialText(copy, "about_heading", "嗨，我是 Angelo。")}
          </h2>
          <p data-cms-field="about_summary" className="mt-5 max-w-[690px] text-[15px] leading-8 text-[#59625a] md:text-base">
            {editorialText(copy, "about_summary", "我在台灣村田做數位轉型，平常接觸的是製造現場的資料、內部流程，以及同事每天真的會遇到的問題。我的工作是把這些需求整理清楚，再做成能用的工具。")}
          </p>
          <p data-cms-field="about_perspective" className="mt-4 max-w-[690px] text-[15px] leading-8 text-[#59625a] md:text-base">
            {editorialText(copy, "about_perspective", "我喜歡先弄懂人是怎麼工作的，再決定要用哪種技術。有時候把資料來源、權限和例外情況理清楚，比選一個新模型更重要。")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#e8ebe6] pt-6">
            <a data-cms-field="about_evidence_label" href="#portfolio" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#202421] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3b5141]">
              {editorialText(copy, "about_evidence_label", "了解我的工作")}
              <ArrowDownRight aria-hidden="true" size={16} />
            </a>
            <a data-cms-field="about_resume_label" href="/resume/Angelo_Lo_English_Resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d9dfd8] px-5 text-sm font-semibold text-[#29312b] transition-colors hover:bg-[#f1f4f0]">
              <FileDown aria-hidden="true" size={16} />
              {editorialText(copy, "about_resume_label", "下載英文履歷")}
              <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
