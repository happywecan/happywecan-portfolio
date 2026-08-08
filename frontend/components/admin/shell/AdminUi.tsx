"use client";

import { AlertCircle, Search, X } from "lucide-react";
import type { ReactNode } from "react";

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

export function AdminAlert({ children }: { children: ReactNode }) {
  return <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={16} />{children}</div>;
}

export function SearchField({ value, onChange, placeholder = "搜尋…" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-500 focus-within:border-zinc-400 sm:max-w-xs"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" /></label>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "neutral" }) {
  const tones = { success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", warning: "bg-amber-50 text-amber-700 ring-amber-600/20", neutral: "bg-zinc-100 text-zinc-700 ring-zinc-600/10" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="px-6 py-16 text-center"><p className="font-semibold text-zinc-900">{title}</p><p className="mt-1 text-sm text-zinc-500">{description}</p></div>;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "刪除", onCancel, onConfirm }: { open: boolean; title: string; description: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-zinc-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 id="confirm-title" className="text-lg font-semibold text-zinc-950 normal-case">{title}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p></div><button onClick={onCancel} aria-label="取消" className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100"><X size={18} /></button></div><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">取消</button><button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">{confirmLabel}</button></div></div></div>;
}

export const primaryButton = "inline-flex items-center justify-center gap-2 rounded-lg bg-[#455ce9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#344ad8] disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50";
export const tableHeader = "px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500";
export const tableCell = "px-5 py-4 align-middle text-sm text-zinc-600";
