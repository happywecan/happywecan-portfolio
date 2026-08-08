"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Globe,
  Home,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdminProfile } from "@/services/authService";

type NavItem = { href: string; label: string; icon: typeof Home };

const primaryItems: NavItem[] = [
  { href: "/admin", label: "儀表板", icon: LayoutDashboard },
];

const contentItems: NavItem[] = [
  { href: "/admin/content/home", label: "首頁內容", icon: Home },
  { href: "/admin/content/portfolio", label: "作品集", icon: BriefcaseBusiness },
  { href: "/admin/content/blog", label: "部落格", icon: BookOpen },
  { href: "/admin/content/profile", label: "關於我", icon: UserRound },
];

const audienceItems: NavItem[] = [
  { href: "/admin/inbox", label: "聯絡訊息", icon: Inbox },
  { href: "/admin/subscribers", label: "電子報訂閱者", icon: UsersRound },
];

const settingsItems: NavItem[] = [
  { href: "/admin/settings", label: "網站設定", icon: Settings },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const renderItem = ({ href, label, icon: Icon }: NavItem) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-white text-zinc-950 shadow-sm"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon size={18} strokeWidth={1.8} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="space-y-7">
      <div className="space-y-1">{primaryItems.map(renderItem)}</div>
      <NavGroup label="網站內容">{contentItems.map(renderItem)}</NavGroup>
      <NavGroup label="訪客互動">{audienceItems.map(renderItem)}</NavGroup>
      <NavGroup label="系統">{settingsItems.map(renderItem)}</NavGroup>
    </nav>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nickname, setNickname] = useState("管理員");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    void getAdminProfile(token)
      .then((profile) => {
        setNickname(profile.nickname || profile.email);
        setAuthorized(true);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const logout = () => {
    localStorage.removeItem("authToken");
    router.replace("/login");
  };

  if (loading || !authorized) {
    return <div className="grid min-h-screen place-items-center bg-zinc-950 text-sm text-zinc-400">正在開啟管理後台…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
        <Brand />
        <div className="mt-8 flex-1 overflow-y-auto"><Navigation /></div>
        <SidebarFooter nickname={nickname} onLogout={logout} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="關閉導覽" className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-zinc-950 p-4 shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><button aria-label="關閉導覽" onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"><X size={20} /></button></div>
            <div className="mt-8 flex-1 overflow-y-auto"><Navigation onNavigate={() => setDrawerOpen(false)} /></div>
            <SidebarFooter nickname={nickname} onLogout={logout} />
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-[#f7f7f5]/90 px-5 backdrop-blur lg:px-10">
          <button aria-label="開啟導覽" onClick={() => setDrawerOpen(true)} className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-200 lg:hidden"><Menu size={22} /></button>
          <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex"><Globe size={14} /><span>Angelo Developer</span><ChevronRight size={14} /><span>管理後台</span></div>
          <a href="/" target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950">查看網站</a>
        </header>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
      </main>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

function Brand() {
  return <Link href="/admin" className="flex items-center gap-3 text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#455ce9] font-mono text-sm font-bold">A.</span><span className="font-mono text-sm font-semibold uppercase tracking-wide">Content Hub</span></Link>;
}

function SidebarFooter({ nickname, onLogout }: { nickname: string; onLogout: () => void }) {
  return <div className="border-t border-white/10 pt-4"><div className="mb-3 flex items-center gap-3 px-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-700 text-xs font-bold text-white">{nickname.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{nickname}</p><p className="text-xs text-zinc-500">管理員</p></div></div><button onClick={onLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-400 hover:bg-white/10 hover:text-white">登出</button></div>;
}
