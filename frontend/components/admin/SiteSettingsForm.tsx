"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/services/apiClient";
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/services/staticContentService";
import { experienceNavLabel } from "@/features/landing/landingContent";

type TextKey = keyof Pick<SiteSettings,
  | "nav_brand_primary" | "nav_brand_secondary" | "nav_mobile_caption"
  | "nav_home_label" | "nav_about_label" | "nav_skills_label"
  | "nav_portfolio_label" | "nav_blog_label" | "nav_contact_label"
  | "social_github" | "social_instagram" | "social_youtube"
  | "intro_splash_keywords"
  | "detail_blog_back_label" | "detail_blog_eyebrow" | "detail_blog_not_found"
  | "detail_portfolio_back_label" | "detail_portfolio_eyebrow" | "detail_portfolio_not_found"
>;

const navigationFields: { key: TextKey; label: string }[] = [
  { key: "nav_brand_primary", label: "品牌名稱" },
  { key: "nav_brand_secondary", label: "滑過時顯示名稱" },
  { key: "nav_home_label", label: "首頁" },
  { key: "nav_about_label", label: "關於" },
  { key: "nav_portfolio_label", label: "工作經驗" },
  { key: "nav_skills_label", label: "技能" },
  { key: "nav_blog_label", label: "Threads" },
  { key: "nav_contact_label", label: "聯絡" },
  { key: "nav_mobile_caption", label: "手機選單說明" },
];

const socialFields: { key: TextKey; label: string }[] = [
  { key: "social_github", label: "GitHub 網址" },
  { key: "social_instagram", label: "Instagram 網址" },
  { key: "social_youtube", label: "YouTube 網址" },
];

const detailFields: { key: TextKey; label: string }[] = [
  { key: "detail_blog_back_label", label: "文章返回按鈕" },
  { key: "detail_blog_eyebrow", label: "文章頁小標" },
  { key: "detail_blog_not_found", label: "文章不存在提示" },
  { key: "detail_portfolio_back_label", label: "Side Projects 返回按鈕" },
  { key: "detail_portfolio_eyebrow", label: "個人專案頁小標" },
  { key: "detail_portfolio_not_found", label: "個人專案不存在提示" },
];

const inputClass = "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500";

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getSiteSettings()
      .then(setSettings)
      .catch((err: unknown) => setError(getErrorMessage(err, "無法載入網站設定")))
      .finally(() => setLoading(false));
  }, []);

  const change = (key: TextKey, value: string) => {
    setSettings((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings) return;
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("請重新登入");
    setSaving(true);
    setError("");
    try {
      setSettings(await updateSiteSettings(settings, token));
      toast.success("網站設定已儲存");
    } catch (err) {
      const message = getErrorMessage(err, "無法儲存網站設定");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-zinc-500">正在載入網站設定…</p>;
  if (!settings) return <p role="alert" className="text-sm text-red-600">{error || "找不到網站設定"}</p>;

  const field = ({ key, label }: { key: TextKey; label: string }) => (
    <label key={key} className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input type={key.startsWith("social_") ? "url" : "text"} value={key === "nav_portfolio_label" ? experienceNavLabel(settings[key]) : settings[key] || ""} onChange={(event) => change(key, event.target.value)} className={inputClass} />
    </label>
  );

  return <form onSubmit={save} className="space-y-6">
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-700">
      首頁文字、照片、表單文字與區塊順序請到 <Link href="/admin/content/home" className="font-semibold text-zinc-950 underline underline-offset-2">首頁內容</Link> 直接預覽修改。這裡只管理全站導覽、社群網址、進站動畫及文章／作品內頁文字。
    </div>

    <section className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-950">全站導覽</h2>
      <p className="mt-1 text-sm text-zinc-500">修改導覽列與手機選單的名稱。</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{navigationFields.map(field)}</div>
    </section>

    <section className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-950">社群連結</h2>
      <p className="mt-1 text-sm text-zinc-500">首頁頁尾的社群按鈕會連到這些網址。</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{socialFields.map(field)}</div>
    </section>

    <section className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-950">進站動畫</h2>
      <p className="mt-1 text-sm text-zinc-500">訪客每天第一次進站時顯示的開場文字。</p>
      <label className="mt-5 flex items-center gap-3 text-sm text-zinc-700">
        <input type="checkbox" checked={Boolean(settings.intro_splash_enabled)} onChange={(event) => setSettings({ ...settings, intro_splash_enabled: event.target.checked })} className="h-4 w-4 accent-zinc-950" />
        啟用進站動畫
      </label>
      <label className="mt-4 block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">關鍵字（以逗號分隔）</span>
        <textarea value={settings.intro_splash_keywords || ""} onChange={(event) => change("intro_splash_keywords", event.target.value)} rows={2} className={inputClass} />
      </label>
    </section>

    <section className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-zinc-950">文章與作品內頁</h2>
      <p className="mt-1 text-sm text-zinc-500">這些文字只用於單篇文章或作品的詳細頁面。</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{detailFields.map(field)}</div>
    </section>

    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <button type="submit" disabled={saving} className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "儲存中…" : "儲存網站設定"}</button>
  </form>;
}
