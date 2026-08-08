"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { createSkill, deleteSkill, getSkills, Skill, updateSkill } from "@/services/skillService";
import SkillForm from "./SkillForm";
import Modal from "@/components/common/Modal";
import { getErrorMessage } from "@/services/apiClient";
import { AdminAlert, AdminPanel, ConfirmDialog, EmptyState, primaryButton, SearchField, tableCell, tableHeader } from "@/components/admin/shell/AdminUi";

export default function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [query, setQuery] = useState(""); const [modalOpen, setModalOpen] = useState(false); const [editingItem, setEditingItem] = useState<Skill | null>(null); const [deletingItem, setDeletingItem] = useState<Skill | null>(null);
  const refresh = async () => { try { setLoading(true); setError(null); setSkills(await getSkills()); } catch (cause) { setError(getErrorMessage(cause, "無法載入技能。")); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, []);
  const filtered = useMemo(() => skills.filter(skill => `${skill.main} ${skill.subSkills.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [skills, query]);
  const closeModal = () => { setModalOpen(false); setEditingItem(null); };
  const save = async (data: Omit<Skill, "id">) => { const token = localStorage.getItem("authToken"); if (!token) return setError("登入已失效，請重新登入。"); try { const id = editingItem?.id || editingItem?._id; if (id) await updateSkill(id, data, token); else await createSkill(data, token); toast.success("技能已儲存"); closeModal(); await refresh(); } catch (cause) { setError(getErrorMessage(cause, "無法儲存技能。")); } };
  const remove = async () => { if (!deletingItem) return; const id = deletingItem.id || deletingItem._id; const token = localStorage.getItem("authToken"); if (!id || !token) return; try { await deleteSkill(id, token); setSkills(items => items.filter(item => (item.id || item._id) !== id)); } catch (cause) { setError(getErrorMessage(cause, "無法刪除技能。")); } finally { setDeletingItem(null); } };
  return <><AdminPanel><div className="flex flex-col gap-3 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between"><SearchField value={query} onChange={setQuery} placeholder="搜尋技能" /><button onClick={() => { setEditingItem(null); setModalOpen(true); }} className={primaryButton}><Plus size={17} />新增技能</button></div>{error && <div className="px-5 pt-5"><AdminAlert>{error}</AdminAlert></div>}{loading ? <EmptyState title="正在載入技能…" description="請稍候。" /> : filtered.length === 0 ? <EmptyState title={query ? "沒有符合的技能" : "還沒有技能"} description="新增一個核心專長開始。" /> : <div className="overflow-x-auto"><table className="min-w-full"><thead className="border-b border-zinc-200 bg-zinc-50"><tr><th className={tableHeader}>核心技能</th><th className={tableHeader}>延伸技能</th><th className={`${tableHeader} text-right`}>操作</th></tr></thead><tbody className="divide-y divide-zinc-100">{filtered.map(item => <tr key={item.id || item._id} className="hover:bg-zinc-50"><td className={`${tableCell} font-semibold text-zinc-900`}>{item.main}</td><td className={tableCell}>{item.subSkills.join("、")}</td><td className={`${tableCell} whitespace-nowrap text-right`}><button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"><Pencil size={17} /></button><button onClick={() => setDeletingItem(item)} className="ml-1 rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>}</AdminPanel><Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? "編輯技能" : "新增技能"}><SkillForm itemToEdit={editingItem} onSave={save} onCancel={closeModal} /></Modal><ConfirmDialog open={Boolean(deletingItem)} title="刪除技能？" description={`「${deletingItem?.main || ""}」將從前台移除。`} onCancel={() => setDeletingItem(null)} onConfirm={() => void remove()} /></>;
}
