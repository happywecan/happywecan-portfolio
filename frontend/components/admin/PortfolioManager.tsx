"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { createPortfolioItem, deletePortfolioItem, getPortfolioItems, PortfolioPayload, updatePortfolioItem } from "@/services/portfolioService";
import { getErrorMessage } from "@/services/apiClient";
import { AdminAlert, AdminPanel, ConfirmDialog, EmptyState, primaryButton, SearchField, tableCell, tableHeader } from "@/components/admin/shell/AdminUi";

interface PortfolioItem { id?: string; _id?: string; title: string; description: string; content?: string; image_url?: string; github_url?: string; demo_url?: string; tags: string[]; created_at: string; }

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);

  const refresh = async () => { try { setLoading(true); setError(null); setItems(await getPortfolioItems()); } catch (cause) { setError(getErrorMessage(cause, "無法載入作品集。")); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, []);
  const filtered = useMemo(() => items.filter(item => `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const closeModal = () => { setModalOpen(false); setEditingItem(null); };
  const save = async (data: Omit<PortfolioItem, "id" | "created_at">) => {
    const token = localStorage.getItem("authToken"); if (!token) return setError("登入已失效，請重新登入。");
    const payload: PortfolioPayload = { title: data.title, description: data.description, image_url: data.image_url || "", content: data.content || "", github_url: data.github_url, demo_url: data.demo_url, tags: data.tags };
    try { const id = editingItem?.id || editingItem?._id; if (id) await updatePortfolioItem(id, payload, token); else await createPortfolioItem(payload, token); closeModal(); await refresh(); } catch (cause) { setError(getErrorMessage(cause, "無法儲存作品。")); }
  };
  const remove = async () => { if (!deletingItem) return; const id = deletingItem.id || deletingItem._id; const token = localStorage.getItem("authToken"); if (!id || !token) return; try { await deletePortfolioItem(id, token); setItems(current => current.filter(item => (item.id || item._id) !== id)); } catch (cause) { setError(getErrorMessage(cause, "無法刪除作品。")); } finally { setDeletingItem(null); } };

  return <><AdminPanel><div className="flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between"><SearchField value={query} onChange={setQuery} placeholder="搜尋作品、描述或標籤" /><button onClick={() => { setEditingItem(null); setModalOpen(true); }} className={primaryButton}><Plus size={17} />新增作品</button></div>{error && <div className="px-5 pt-5"><AdminAlert>{error}</AdminAlert></div>}{loading ? <EmptyState title="正在載入作品集…" description="請稍候。" /> : filtered.length === 0 ? <EmptyState title={query ? "沒有符合的作品" : "還沒有作品"} description={query ? "試試其他關鍵字。" : "建立第一個要展示的專案。"} /> : <div className="overflow-x-auto"><table className="min-w-full"><thead className="border-b border-zinc-200 bg-zinc-50"><tr><th className={tableHeader}>作品</th><th className={tableHeader}>標籤</th><th className={`${tableHeader} text-right`}>操作</th></tr></thead><tbody className="divide-y divide-zinc-100">{filtered.map(item => <tr key={item.id || item._id} className="hover:bg-zinc-50/70"><td className={tableCell}><p className="font-semibold text-zinc-900">{item.title}</p><p className="mt-1 max-w-xl truncate text-xs text-zinc-500">{item.description}</p></td><td className={tableCell}><div className="flex max-w-xs flex-wrap gap-1">{item.tags.map(tag => <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{tag}</span>)}</div></td><td className={`${tableCell} text-right whitespace-nowrap`}><button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" aria-label={`編輯 ${item.title}`}><Pencil size={17} /></button><button onClick={() => setDeletingItem(item)} className="ml-1 rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600" aria-label={`刪除 ${item.title}`}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>}</AdminPanel><Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? "編輯作品" : "新增作品"}><PortfolioForm itemToEdit={editingItem} onSave={save} onCancel={closeModal} /></Modal><ConfirmDialog open={Boolean(deletingItem)} title="刪除作品？" description={`「${deletingItem?.title || ""}」將從網站移除，且無法復原。`} onCancel={() => setDeletingItem(null)} onConfirm={() => void remove()} /></>;
}
