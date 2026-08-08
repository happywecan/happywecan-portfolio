"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, BriefcaseBusiness, Inbox, PenLine, Plus, Settings } from "lucide-react";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";
import { getBlogPostsAdmin } from "@/services/blogService";
import { getContactsAdmin } from "@/services/contactService";
import { getPortfolioItems } from "@/services/portfolioService";

type Summary = { portfolio: number; posts: number; drafts: number; unread: number };

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    void Promise.all([getPortfolioItems(), getBlogPostsAdmin(token), getContactsAdmin(token)])
      .then(([portfolio, posts, contacts]) => setSummary({ portfolio: portfolio.length, posts: posts.length, drafts: posts.filter(post => !post.is_published).length, unread: contacts.filter(contact => !contact.read).length }))
      .catch(() => setSummary({ portfolio: 0, posts: 0, drafts: 0, unread: 0 }));
  }, []);

  const stats = [
    { label: "作品集", value: summary?.portfolio, href: "/admin/content/portfolio", icon: BriefcaseBusiness },
    { label: "已建立文章", value: summary?.posts, href: "/admin/content/blog", icon: BookOpen },
    { label: "草稿文章", value: summary?.drafts, href: "/admin/content/blog", icon: PenLine },
    { label: "未讀訊息", value: summary?.unread, href: "/admin/inbox", icon: Inbox },
  ];

  return <>
    <AdminPageHeader title="儀表板" description="從這裡掌握網站內容與待處理的訪客訊息。" />
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, href, icon: Icon }) => <Link key={label} href={href} className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-100 text-zinc-700"><Icon size={19} /></span><span className="text-xs text-zinc-400">查看 <span className="group-hover:text-zinc-700">→</span></span></div><p className="mt-7 text-3xl font-semibold tracking-tight text-zinc-950">{value ?? "—"}</p><p className="mt-1 text-sm text-zinc-500">{label}</p></Link>)}
    </section>
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold normal-case tracking-tight">快速開始</h2><p className="mt-1 text-sm text-zinc-500">常用的內容操作都集中在這裡。</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><QuickLink href="/admin/content/portfolio" label="新增或整理作品" icon={Plus} /><QuickLink href="/admin/content/blog" label="撰寫部落格文章" icon={PenLine} /><QuickLink href="/admin/content/home" label="編輯首頁介紹" icon={Settings} /><QuickLink href="/admin/inbox" label="處理訪客訊息" icon={Inbox} /></div></div>
      <div className="rounded-2xl bg-zinc-950 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">內容工作流</p><h2 className="mt-3 text-xl font-semibold normal-case tracking-tight">建立、確認、發布</h2><p className="mt-2 text-sm leading-6 text-zinc-400">把作品與文章放在內容區維護；首頁與全站文字則分別在首頁內容和網站設定調整。</p><Link href="/admin/content/blog" className="mt-6 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">前往內容管理</Link></div>
    </section>
  </>;
}

function QuickLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Plus }) { return <Link href={href} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 text-sm font-medium text-zinc-700 transition hover:border-[#455ce9] hover:text-[#455ce9]"><Icon size={18} />{label}</Link>; }
