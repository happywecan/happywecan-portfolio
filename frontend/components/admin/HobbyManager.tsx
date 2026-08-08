"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { createHobby, deleteHobby, getHobbies, Hobby, updateHobby } from "@/services/hobbyService";
import HobbyForm from "./HobbyForm";
import Modal from "@/components/common/Modal";
import { getErrorMessage } from "@/services/apiClient";
import { AdminAlert, AdminPanel, ConfirmDialog, EmptyState, primaryButton, SearchField, tableCell, tableHeader } from "@/components/admin/shell/AdminUi";

export default function HobbyManager() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [query, setQuery] = useState(""); const [modalOpen, setModalOpen] = useState(false); const [editingItem, setEditingItem] = useState<Hobby | null>(null); const [deletingItem, setDeletingItem] = useState<Hobby | null>(null);
  const refresh = async () => { try { setLoading(true); setError(null); setHobbies(await getHobbies()); } catch (cause) { setError(getErrorMessage(cause, "無法載入興趣。")); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, []);
  const filtered = useMemo(() => hobbies.filter(item => `${item.name} ${item.description || ""}`.toLowerCase().includes(query.toLowerCase())), [hobbies, query]);
  const closeModal = () => { setModalOpen(false); setEditingItem(null); };
  const save = async (data: Omit<Hobby, "id" | "_id">) => { const token = localStorage.getItem("authToken"); if (!token) return setError("登入已失效，請重新登入。"); try { const id = editingItem?.id || editingItem?._id; if (id) await updateHobby(id, data, token); else await createHobby(data, token); toast.success("興趣已儲存"); closeModal(); await refresh(); } catch (cause) { setError(getErrorMessage(cause, "無法儲存興趣。")); } };
  const remove = async () => { if (!deletingItem) return; const id = deletingItem.id || deletingItem._id; const token = localStorage.getItem("authToken"); if (!id || !token) return; try { await deleteHobby(id, token); setHobbies(items => items.filter(item => (item.id || item._id) !== id)); } catch (cause) { setError(getErrorMessage(cause, "無法刪除興趣。")); } finally { setDeletingItem(null); } };
  return <><AdminPanel><div className="flex flex-col gap-3 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between"><SearchField value={query} onChange={setQuery} placeholder="搜尋興趣" /><button onClick={() => { setEditingItem(null); setModalOpen(true); }} className={primaryButton}><Plus size={17} />新增興趣</button></div>{error && <div className="px-5 pt-5"><AdminAlert>{error}</AdminAlert></div>}{loading ? <EmptyState title="正在載入興趣…" description="請稍候。" /> : filtered.length === 0 ? <EmptyState title={query ? "沒有符合的興趣" : "還沒有興趣"} description="新增一個興趣來豐富自我介紹。" /> : <div className="overflow-x-auto"><table className="min-w-full"><thead className="border-b border-zinc-200 bg-zinc-50"><tr><th className={tableHeader}>興趣</th><th className={tableHeader}>描述</th><th className={`${tableHeader} text-right`}>操作</th></tr></thead><tbody className="divide-y divide-zinc-100">{filtered.map(item => <tr key={item.id || item._id} className="hover:bg-zinc-50"><td className={`${tableCell} font-semibold text-zinc-900`}>{item.name}</td><td className={tableCell}>{item.description || "—"}</td><td className={`${tableCell} whitespace-nowrap text-right`}><button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"><Pencil size={17} /></button><button onClick={() => setDeletingItem(item)} className="ml-1 rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>}</AdminPanel><Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? "編輯興趣" : "新增興趣"}><HobbyForm itemToEdit={editingItem} onSave={save} onCancel={closeModal} /></Modal><ConfirmDialog open={Boolean(deletingItem)} title="刪除興趣？" description={`「${deletingItem?.name || ""}」將從前台移除。`} onCancel={() => setDeletingItem(null)} onConfirm={() => void remove()} /></>;
}
