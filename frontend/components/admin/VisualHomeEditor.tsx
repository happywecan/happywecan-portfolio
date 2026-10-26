"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImageUp, RotateCcw, Save } from "lucide-react";
import { toast } from "react-toastify";
import { CASE_STUDIES, PRODUCTS, experienceTitle } from "@/features/landing/landingContent";
import { SKILL_GROUPS } from "@/features/landing/skillsContent";
import { DEFAULT_THREADS_POSTS, validThreadsPostUrl } from "@/features/landing/NotesSection";
import { DEFAULT_HERO_SETTINGS, getHeroSettings, getSiteSettings, type HeroSettings, type SiteSettings } from "@/services/staticContentService";
import type { CmsPage } from "@/services/pageService";
import { uploadImage } from "@/services/uploadService";
import { getErrorMessage } from "@/services/apiClient";

type Section = "hero" | "about" | "skills" | "portfolio" | "blog" | "contact";
type Field = { key: string; label: string; fallback: string; multiline?: boolean; image?: boolean; url?: boolean };

const sections: { id: Section; label: string }[] = [
  { id: "hero", label: "首頁主視覺" },
  { id: "about", label: "關於我" },
  { id: "portfolio", label: "工作經驗" },
  { id: "skills", label: "程式與技術" },
  { id: "blog", label: "Threads" },
  { id: "contact", label: "聯絡" },
];

function fieldsFor(section: Section, hero: HeroSettings, site: SiteSettings | null): Field[] {
  switch (section) {
    case "hero": return [
      { key: "hero_main_title", label: "主標題", fallback: hero.hero_main_title },
      { key: "hero_subtitle", label: "副標題", fallback: hero.hero_subtitle },
      { key: "hero_bio_content", label: "簡介", fallback: hero.hero_bio_content, multiline: true },
      { key: "hero_button_1_label", label: "工作經驗按鈕", fallback: /^(View Work|查看作品集)$/i.test(hero.hero_button_1_label) ? "查看工作經驗" : hero.hero_button_1_label },
      { key: "hero_button_2_label", label: "聯絡按鈕", fallback: hero.hero_button_2_label },
      { key: "hero_resume_label", label: "履歷下載按鈕", fallback: "Download Resume" },
      { key: "hero_background_image_url", label: "背景圖片", fallback: hero.hero_background_image_url || "", image: true },
      { key: "hero_personal_photo_url", label: "個人照片", fallback: hero.hero_personal_photo_url || "", image: true },
    ];
    case "about": return [
      { key: "about_section_label", label: "區塊編號", fallback: "01 / About" },
      { key: "about_eyebrow", label: "顯示姓名", fallback: "Angelo Lo" },
      { key: "about_heading", label: "一句話自我介紹", fallback: "嗨，我是 Angelo。", multiline: true },
      { key: "about_role_label", label: "職稱前綴", fallback: "目前職務" },
      { key: "about_role", label: "目前職稱", fallback: "Digital Transformation Specialist" },
      { key: "about_summary", label: "簡短介紹", fallback: "我在台灣村田做數位轉型，平常接觸的是製造現場的資料、內部流程，以及同事每天真的會遇到的問題。我的工作是把這些需求整理清楚，再做成能用的工具。", multiline: true },
      { key: "about_perspective", label: "我的觀點", fallback: "我喜歡先弄懂人是怎麼工作的，再決定要用哪種技術。有時候把資料來源、權限和例外情況理清楚，比選一個新模型更重要。", multiline: true },
      { key: "about_evidence_label", label: "工作經驗按鈕文字", fallback: "了解我的工作" },
      { key: "about_resume_label", label: "履歷按鈕文字", fallback: "下載英文履歷" },
    ];
    case "skills": return [
      { key: "skills_eyebrow", label: "區塊小標", fallback: "03 / Skills" },
      { key: "skills_heading", label: "技能主標題", fallback: "技術與工具", multiline: true },
      { key: "skills_intro", label: "技能摘要", fallback: "我在工作和個人專案中用過的工具。點選標籤可以看相關案例。", multiline: true },
      ...SKILL_GROUPS.flatMap((group): Field[] => [
        { key: `skill_group_${group.id}_label`, label: `${group.label} 分類名稱`, fallback: group.label },
        { key: `skill_group_${group.id}_tags`, label: `${group.label} 技能（用 · 分隔）`, fallback: group.skills.map((skill) => skill.name).join(" · ") },
        { key: `skill_group_${group.id}_core`, label: `${group.label} 核心技能（用 · 分隔）`, fallback: group.skills.filter((skill) => skill.core).map((skill) => skill.name).join(" · ") },
        { key: `skill_group_${group.id}_production`, label: `${group.label} 正式環境使用（用 · 分隔）`, fallback: group.skills.filter((skill) => skill.production).map((skill) => skill.name).join(" · ") },
      ]),
    ];
    case "portfolio": return [
      { key: "portfolio_eyebrow", label: "區塊小標", fallback: "02 / Experience" },
      { key: "portfolio_title", label: "區塊標題", fallback: experienceTitle(site?.portfolio_title) },
      { key: "about_company", label: "公司與任職期間", fallback: "Taiwan Murata · 2025—Present" },
      { key: "about_role", label: "職稱", fallback: "Digital Transformation Specialist" },
      { key: "about_projects_label", label: "工作成果小標", fallback: "主要工作成果" },
      ...CASE_STUDIES.flatMap((item): Field[] => [
        { key: `case_${item.number}_label`, label: `案例 ${item.number} 標籤`, fallback: item.label },
        { key: `case_${item.number}_title`, label: `案例 ${item.number} 標題`, fallback: item.title },
        { key: `case_${item.number}_body`, label: `案例 ${item.number} 說明`, fallback: item.body, multiline: true },
        { key: `case_${item.number}_tags`, label: `案例 ${item.number} 技術標籤`, fallback: item.tags },
      ]),
      { key: "products_eyebrow", label: "其他工作小標", fallback: "Additional contributions" },
      { key: "products_heading", label: "其他工作標題", fallback: "其他參與項目" },
      ...PRODUCTS.flatMap(([title, body], index): Field[] => [
        { key: `product_${index + 1}_title`, label: `更多作品 ${index + 1} 標題`, fallback: title },
        { key: `product_${index + 1}_body`, label: `更多作品 ${index + 1} 說明`, fallback: body, multiline: true },
      ]),
      { key: "about_projects_note", label: "公開範圍說明", fallback: "僅說明可公開的工作範圍，不包含公司內部資料與系統畫面。" },
    ];
    case "blog": return [
      { key: "blog_title", label: "區塊標題", fallback: site?.blog_title?.trim() || "Notes from the work" },
      { key: "blog_description", label: "簡介", fallback: "我偶爾把工作中遇到的問題、試過的方法和學到的東西記在 Threads。", multiline: true },
      ...DEFAULT_THREADS_POSTS.map((url, index): Field => ({ key: `threads_post_${index + 1}_url`, label: `第 ${index + 1} 篇 Threads 貼文`, fallback: url, url: true })),
    ];
    case "contact": return [
      { key: "contact_title", label: "區塊標題", fallback: site?.contact_title || "Contact" },
      { key: "contact_intro", label: "聯絡標籤", fallback: site?.contact_intro_label || "Get in touch" },
      { key: "contact_email", label: "公開 Email", fallback: site?.contact_email || "angelo@example.com" },
      { key: "contact_location_label", label: "地點標籤", fallback: site?.contact_location_label || "Location" },
      { key: "contact_location", label: "地點", fallback: site?.contact_location || "Taipei, Taiwan" },
      { key: "contact_name_label", label: "姓名欄標籤", fallback: site?.contact_name_label || "01 / What's your name?" },
      { key: "contact_name_placeholder", label: "姓名欄提示", fallback: site?.contact_name_placeholder || "NAME" },
      { key: "contact_email_label", label: "Email 欄標籤", fallback: site?.contact_email_label || "02 / What's your email?" },
      { key: "contact_email_placeholder", label: "Email 欄提示", fallback: site?.contact_email_placeholder || "EMAIL" },
      { key: "contact_message_label", label: "訊息欄標籤", fallback: site?.contact_message_label || "03 / Your message" },
      { key: "contact_message_placeholder", label: "訊息欄提示", fallback: site?.contact_message_placeholder || "MESSAGE" },
      { key: "contact_submit_label", label: "送出按鈕", fallback: site?.contact_submit_label || "Send" },
      { key: "contact_submitting_label", label: "送出中按鈕", fallback: site?.contact_submitting_label || "Sending" },
      { key: "contact_socials_label", label: "社群標籤", fallback: site?.contact_socials_label || "Socials" },
      { key: "contact_footer_note", label: "頁尾文字", fallback: site?.contact_footer_note || "© 2026 Angelo — Created with Passion" },
      { key: "contact_footer_stack", label: "頁尾技術文字", fallback: site?.contact_footer_stack || "Built with Next.js & GSAP" },
      { key: "contact_local_time_label", label: "當地時間標籤", fallback: site?.contact_local_time_label || "Local Time" },
    ];
  }
}

export default function VisualHomeEditor({ page, onChange, onSave, dirty, saving }: {
  page: CmsPage;
  onChange: (index: number, key: string, value: string | undefined) => void;
  onSave: () => void;
  dirty: boolean;
  saving: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState<Section>("hero");
  const [focusedField, setFocusedField] = useState("");
  const [hero, setHero] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [mobile, setMobile] = useState(false);
  const editorialIndex = page.blocks.findIndex((block) => block.type === "editorial" && block.enabled);
  const editorial = page.blocks[editorialIndex];
  const postsKey = DEFAULT_THREADS_POSTS.map((_, index) => String(editorial?.content[`threads_post_${index + 1}_url`] || "")).join("|");
  const choose = (section: Section) => {
    setSelected(section);
    setFocusedField("");
    frame.current?.contentWindow?.postMessage({ type: "cms-preview-scroll", section }, window.location.origin);
  };

  useEffect(() => {
    void getHeroSettings().then(setHero);
    void getSiteSettings().then(setSite).catch(() => undefined);
  }, []);

  useEffect(() => {
    const send = () => frame.current?.contentWindow?.postMessage({ type: "cms-preview-page", page }, window.location.origin);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "cms-preview-ready") send();
      if (event.data?.type === "cms-preview-select" && sections.some((section) => section.id === event.data.section)) {
        setSelected(event.data.section as Section);
        setFocusedField(typeof event.data.field === "string" ? event.data.field : "");
      }
    };
    window.addEventListener("message", receive);
    send();
    return () => window.removeEventListener("message", receive);
  }, [page]);

  useEffect(() => {
    if (!focusedField) return;
    const input = document.getElementById(`cms-field-${focusedField}`);
    input?.scrollIntoView({ block: "nearest" });
    input?.focus({ preventScroll: true });
  }, [selected, focusedField]);

  if (!editorial) return <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">目前首頁使用自訂區塊。請在下方的區塊編排表單修改內容。</div>;

  return <section aria-label="視覺化首頁編輯" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
      <div><h2 className="text-lg font-semibold text-zinc-950">直接在畫面選擇要編輯的區塊</h2><p className="mt-1 text-xs text-zinc-500">先看預覽、點選區塊，再在右側修改。儲存前只有你看得到變更。</p></div>
      <div className="flex items-center gap-2"><button type="button" onClick={() => setMobile((value) => !value)} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700">{mobile ? "桌面寬度" : "手機寬度"}</button><button type="button" onClick={onSave} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"><Save size={14} />{saving ? "儲存中…" : "儲存並發布"}</button></div>
    </div>
    <div className="grid min-w-0 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,380px)]">
      <div className="min-w-0 overflow-hidden bg-zinc-200 p-2 sm:p-4"><div className={`mx-auto h-[min(72vh,760px)] min-h-[500px] overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-xl transition-[width] ${mobile ? "w-[390px] max-w-full" : "w-full"}`}><iframe key={postsKey} ref={frame} title="可點選的首頁預覽" src="/preview/home?edit=1" onLoad={() => frame.current?.contentWindow?.postMessage({ type: "cms-preview-page", page }, window.location.origin)} className="h-full w-full border-0" /></div></div>
      <div className="min-w-0 border-t border-zinc-200 p-4 sm:p-5 2xl:max-h-[800px] 2xl:overflow-y-auto 2xl:border-l 2xl:border-t-0">
        <div className="mb-5 flex flex-wrap gap-1.5">{sections.map((section) => <button key={section.id} type="button" onClick={() => choose(section.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${selected === section.id ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>{section.label}</button>)}</div>
        <h3 className="mb-1 text-base font-semibold text-zinc-950">{sections.find((section) => section.id === selected)?.label}</h3>
        <p className="mb-5 text-xs text-zinc-500">欄位修改後，左側預覽會立即更新。</p>
        <div className="space-y-5">{fieldsFor(selected, hero, site).map((field) => {
          const override = editorial.content[field.key];
          const value = typeof override === "string" ? override : field.fallback;
          return <div key={field.key}><div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-zinc-700"><label htmlFor={`cms-field-${field.key}`}>{field.label}</label>{typeof override === "string" && <button type="button" title="恢復預設內容" onClick={() => onChange(editorialIndex, field.key, undefined)} className="text-zinc-400 hover:text-zinc-800"><RotateCcw size={13} /></button>}</div>{field.image ? <ImageUploadEditor id={`cms-field-${field.key}`} value={value} onChange={(next) => onChange(editorialIndex, field.key, next)} /> : field.url ? <ThreadsUrlEditor id={`cms-field-${field.key}`} value={value} onChange={(next) => onChange(editorialIndex, field.key, next)} /> : field.multiline ? <textarea id={`cms-field-${field.key}`} value={value} onChange={(event) => onChange(editorialIndex, field.key, event.target.value)} rows={3} className="w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500" /> : <input id={`cms-field-${field.key}`} value={value} onChange={(event) => onChange(editorialIndex, field.key, event.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500" />}</div>;
        })}</div>
        <p className="mt-6 text-xs leading-5 text-zinc-500">儲存並發布會更新正式首頁。導覽名稱與社群網址請到網站設定修改。</p>
        <a href="/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-zinc-700 underline underline-offset-2">另開正式網站 <ExternalLink size={12} /></a>
      </div>
    </div>
  </section>;
}

function ImageUploadEditor({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file?: File) => {
    const token = localStorage.getItem("authToken");
    if (!file || !token) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, token);
      onChange(url);
      toast.success("圖片已上傳；發布首頁後才會顯示給訪客。");
    } catch (error) {
      toast.error(getErrorMessage(error, "圖片上傳失敗"));
    } finally {
      setUploading(false);
    }
  };
  return <div className="space-y-2"><input id={id} value={value} readOnly className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600" placeholder="尚未設定圖片" /><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"><ImageUp size={14} />{uploading ? "上傳中…" : "上傳圖片"}<input type="file" accept="image/*" disabled={uploading} className="sr-only" onChange={(event) => void upload(event.target.files?.[0])} /></label></div>;
}

function ThreadsUrlEditor({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    if (draft === value) return;
    if (!validThreadsPostUrl(draft)) {
      toast.error("請貼上完整的 Threads 貼文網址。");
      setDraft(value);
      return;
    }
    onChange(new URL(draft).origin + new URL(draft).pathname);
  };
  return <input id={id} type="url" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-zinc-500" />;
}
