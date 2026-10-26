import Link from "next/link";
import { CASE_STUDIES, PRODUCTS } from "./landingContent";
import { editorialText, type EditorialCopy } from "./editorialCopy";
import { SkillsExplorer } from "./SkillsExplorer";

interface WorkShowcaseProps {
  portfolioTitle: string;
  mode?: "all" | "skills" | "portfolio";
  copy?: EditorialCopy;
  integrated?: boolean;
}

export function WorkShowcase({ portfolioTitle, mode = "all", copy, integrated = false }: WorkShowcaseProps) {
  return (
    <>
      {mode !== "portfolio" && (
        <section id="skills" data-cms-section="skills" className="scroll-mt-20 bg-[#f3f4f1] px-5 pb-10 pt-4 text-[#202421] md:px-10 md:pb-12">
          <div className="mx-auto max-w-[850px]">
            <div className="py-8 md:py-10">
              <p data-cms-field="skills_eyebrow" className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#5d675e]">{editorialText(copy, "skills_eyebrow", "03 / Skills")}</p>
              <h2 data-cms-field="skills_heading" className="mt-4 text-[clamp(2rem,3.5vw,2.9rem)] font-semibold leading-tight tracking-[-.05em]">{editorialText(copy, "skills_heading", "技術與工具")}</h2>
              <p data-cms-field="skills_intro" className="mt-3 max-w-[620px] text-[15px] leading-7 text-[#647067]">{editorialText(copy, "skills_intro", "我在工作和個人專案中用過的工具。點選標籤可以看相關案例。")}</p>
              <SkillsExplorer copy={copy} />
            </div>
          </div>
        </section>
      )}

      {mode !== "skills" && (
        <section id="portfolio" data-cms-section="portfolio" className="bg-[#f3f4f1] px-5 pb-4 text-[#202421] md:px-10">
          <div className={`mx-auto max-w-[850px] border border-[#e0e3dd] bg-white px-6 py-8 shadow-[0_20px_60px_-40px_rgba(24,32,26,.16)] md:px-11 md:py-10 ${integrated ? "rounded-b-[28px] border-t-0" : "rounded-[28px]"}`}>
            {integrated && <div aria-hidden="true" className="mb-8 border-t border-[#e8ebe6]" />}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p data-cms-field="portfolio_eyebrow" className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#66806a]">{editorialText(copy, "portfolio_eyebrow", "02 / Experience")}</p>
                <h2 data-cms-field="portfolio_title" className="mt-3 text-[clamp(2rem,3.5vw,2.9rem)] font-semibold tracking-[-.05em]">{editorialText(copy, "portfolio_title", portfolioTitle)}</h2>
              </div>
              <Link href="/side-projects" className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#d9dfd8] px-5 text-sm font-semibold transition-colors hover:bg-[#f1f4f0] sm:w-auto">Side Projects ↗</Link>
            </div>
            <div className="mt-9 grid gap-4 border-y border-[#e8ebe6] py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p data-cms-field="about_company" className="text-sm font-semibold text-[#4d7652]">{editorialText(copy, "about_company", "Taiwan Murata · 2025—Present")}</p>
                <h3 data-cms-field="about_role" className="mt-2 text-xl font-semibold tracking-[-.03em] md:text-2xl">{editorialText(copy, "about_role", "Digital Transformation Specialist")}</h3>
              </div>
              <p className="text-[11px] uppercase tracking-[.14em] text-[#869087]">Manufacturing DX / AI applications</p>
            </div>
            <p data-cms-field="about_projects_label" className="mt-9 text-[11px] font-semibold uppercase tracking-[.16em] text-[#66806a]">{editorialText(copy, "about_projects_label", "主要工作成果")}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {CASE_STUDIES.map((item) => (
                <article id={`case-${item.number}`} key={item.number} className="scroll-mt-24 rounded-2xl border border-[#e2e6e0] bg-[#f7f9f5] p-5 md:p-6">
                  <div className={`mb-6 h-1 w-8 ${item.accentClassName}`} />
                  <p data-cms-field={`case_${item.number}_label`} className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#738c76]">
                    {item.number} / {editorialText(copy, `case_${item.number}_label`, item.label)}
                  </p>
                  <h4 data-cms-field={`case_${item.number}_title`} className="mt-3 text-lg font-semibold leading-snug tracking-[-.035em]">{editorialText(copy, `case_${item.number}_title`, item.title)}</h4>
                  <p data-cms-field={`case_${item.number}_body`} className="mt-3 text-[13px] leading-6 text-[#607066]">{editorialText(copy, `case_${item.number}_body`, item.body)}</p>
                  <p data-cms-field={`case_${item.number}_tags`} className="mt-6 text-[11px] leading-5 text-[#4d7652]">{editorialText(copy, `case_${item.number}_tags`, item.tags)}</p>
                </article>
              ))}
            </div>

            <div className="mt-10">
              <p data-cms-field="products_eyebrow" className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#66806a]">{editorialText(copy, "products_eyebrow", "Additional contributions")}</p>
              <h3 data-cms-field="products_heading" className="mt-3 text-xl font-semibold tracking-[-.03em]">{editorialText(copy, "products_heading", "其他參與項目")}</h3>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {PRODUCTS.map(([title, body], index) => (
                  <article id={`product-${index + 1}`} key={title} className="scroll-mt-24 rounded-xl border border-[#e2e6e0] p-4">
                    <h4 data-cms-field={`product_${index + 1}_title`} className="text-sm font-semibold">{editorialText(copy, `product_${index + 1}_title`, title)}</h4>
                    <p data-cms-field={`product_${index + 1}_body`} className="mt-3 text-xs leading-5 text-[#607066]">{editorialText(copy, `product_${index + 1}_body`, body)}</p>
                  </article>
                ))}
              </div>
            </div>
            <p data-cms-field="about_projects_note" className="mt-7 text-xs leading-5 text-[#879087]">{editorialText(copy, "about_projects_note", "僅說明可公開的工作範圍，不包含公司內部資料與系統畫面。")}</p>
          </div>
        </section>
      )}
    </>
  );
}
