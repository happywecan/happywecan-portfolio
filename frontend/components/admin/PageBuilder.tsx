"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, GripVertical, History, ImageUp, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AdminAlert, AdminPanel, primaryButton, secondaryButton } from "./shell/AdminUi";
import { getErrorMessage } from "@/services/apiClient";
import { getPage, getPageRevisions, restorePage, updatePage, type CmsPage, type PageBlock, type PageBlockType, type PageRevision } from "@/services/pageService";
import { uploadImage } from "@/services/uploadService";

const blockTypes: Array<{ type: PageBlockType; label: string; description: string }> = [
  { type: "editorial", label: "完整作品首頁", description: "目前的整頁設計，保留原本首頁外觀" },
  { type: "hero", label: "首頁主視覺", description: "使用現有主視覺設定與版型" },
  { type: "about", label: "關於我", description: "顯示目前固定的定位介紹" },
  { type: "skills", label: "工作方式", description: "顯示目前固定的工程方法" },
  { type: "portfolio", label: "作品展示", description: "顯示目前固定的案例內容" },
  { type: "blog", label: "文章入口", description: "顯示目前固定的文章入口" },
  { type: "contact", label: "聯絡表單", description: "訪客留言與聯絡資訊" },
  { type: "rich_text", label: "文字內容", description: "標題與簡單 Markdown 內容" },
  { type: "image_text", label: "圖文內容", description: "圖片搭配標題與說明" },
  { type: "cta", label: "行動呼籲", description: "醒目標題與連結按鈕" },
  { type: "spacer", label: "留白", description: "調整區塊之間的距離" },
];

const defaults: Record<PageBlockType, Record<string, unknown>> = {
  editorial: {}, hero: {}, about: {}, skills: {}, portfolio: {}, blog: {}, contact: {},
  rich_text: { eyebrow: "內容", title: "新的內容區塊", body: "在這裡輸入內容。" },
  image_text: { eyebrow: "精選", title: "圖文標題", body: "在這裡輸入說明。", image_url: "", image_alt: "", image_side: "left" },
  cta: { title: "想進一步聊聊嗎？", body: "歡迎與我聯絡。", button_label: "聯絡我", button_url: "#contact" },
  spacer: { size: "medium" },
};

const labelFor = (type: PageBlockType) => blockTypes.find((item) => item.type === type)?.label || type;

export default function PageBuilder({ initialPage }: { initialPage?: CmsPage }) {
  const [page, setPage] = useState<CmsPage | null>(initialPage || null);
  const [published, setPublished] = useState<CmsPage | null>(initialPage || null);
  const [preview, setPreview] = useState(false);
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedType, setSelectedType] = useState<PageBlockType>("rich_text");
  const [loading, setLoading] = useState(!initialPage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragged, setDragged] = useState<number | null>(null);

  useEffect(() => { if (!initialPage) void getPage("home").then((data) => { setPage(data); setPublished(data); }).catch((err) => setError(getErrorMessage(err, "無法載入首頁配置"))).finally(() => setLoading(false)); }, [initialPage]);
  useEffect(() => {
    if (!preview || !page) return;
    const sendPreview = () => previewFrame.current?.contentWindow?.postMessage({ type: "cms-preview-page", page }, window.location.origin);
    const onMessage = (event: MessageEvent) => { if (event.origin === window.location.origin && event.source === previewFrame.current?.contentWindow && event.data?.type === "cms-preview-ready") sendPreview(); };
    window.addEventListener("message", onMessage);
    sendPreview();
    return () => window.removeEventListener("message", onMessage);
  }, [preview, page]);
  const dirty = !!page && !!published && JSON.stringify({ title: page.title, blocks: page.blocks }) !== JSON.stringify({ title: published.title, blocks: published.blocks });
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  const changeBlocks = (blocks: PageBlock[]) => setPage((current) => current ? { ...current, blocks } : current);
  const updateBlock = (index: number, patch: Partial<PageBlock>) => page && changeBlocks(page.blocks.map((block, current) => current === index ? { ...block, ...patch } : block));
  const updateContent = (index: number, key: string, value: unknown) => { const block = page?.blocks[index]; if (block) updateBlock(index, { content: { ...block.content, [key]: value } }); };
  const addBlock = () => page && changeBlocks([...page.blocks, { id: crypto.randomUUID(), type: selectedType, enabled: true, content: { ...defaults[selectedType] } }]);
  const duplicate = (index: number) => { if (!page) return; const copy = { ...page.blocks[index], id: crypto.randomUUID(), content: { ...page.blocks[index].content } }; const blocks = [...page.blocks]; blocks.splice(index + 1, 0, copy); changeBlocks(blocks); };
  const remove = (index: number) => page && changeBlocks(page.blocks.filter((_, current) => current !== index));
  const dropAt = (target: number) => { if (!page || dragged === null || dragged === target) return setDragged(null); const blocks = [...page.blocks]; const [item] = blocks.splice(dragged, 1); blocks.splice(target, 0, item); changeBlocks(blocks); setDragged(null); };
  const move = (index: number, direction: number) => { if (!page) return; const target = index + direction; if (target < 0 || target >= page.blocks.length) return; const blocks = [...page.blocks]; [blocks[index], blocks[target]] = [blocks[target], blocks[index]]; changeBlocks(blocks); };
  const openHistory = async () => { const token = localStorage.getItem("authToken"); if (!token) return; try { setRevisions(await getPageRevisions("home", token)); setShowHistory(true); } catch (err) { toast.error(getErrorMessage(err, "無法載入發布紀錄")); } };
  const restore = async (version: number) => { const token = localStorage.getItem("authToken"); if (!token || !page || !window.confirm("復原此版本並立即發布？目前版本會保留在紀錄中。")) return; try { const result = await restorePage("home", version, page.version, token); setPage(result); setPublished(result); setShowHistory(false); toast.success("已復原並發布"); } catch (err) { toast.error(getErrorMessage(err, "復原失敗")); } };
  const save = async () => {
    if (!page) return; const token = localStorage.getItem("authToken"); if (!token) return toast.error("請重新登入");
    setSaving(true); setError("");
    try { const result = await updatePage("home", { title: page.title, version: page.version, blocks: page.blocks }, token); setPage(result); setPublished(result); toast.success("首頁配置已發布"); }
    catch (err) { const message = getErrorMessage(err, "儲存失敗"); setError(message); toast.error(message); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-sm text-zinc-500">正在載入頁面編輯器…</p>;
  if (!page) return <AdminAlert>{error || "找不到首頁配置"}</AdminAlert>;

  return <div className="space-y-6">
    {error && <AdminAlert>{error}</AdminAlert>}
    <AdminPanel className="p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><label className="block flex-1"><span className="mb-2 block text-sm font-semibold text-zinc-700">頁面名稱</span><input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400" /></label><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-zinc-500" role="status">{dirty ? "有未發布變更" : "已發布"}</span><button onClick={() => void openHistory()} className={secondaryButton}><History size={16} />發布紀錄</button><button onClick={() => setPreview(true)} className={secondaryButton}><Eye size={16} />預覽</button><button onClick={save} disabled={saving || !dirty} className={primaryButton}><Save size={16} />{saving ? "發布中…" : "發布首頁"}</button></div></div></AdminPanel>
    <div className="space-y-3">{page.blocks.map((block, index) => <AdminPanel key={block.id} className={block.enabled ? "" : "opacity-60"}>
      <div draggable onDragStart={() => setDragged(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropAt(index)} className="flex cursor-move items-center gap-3 border-b border-zinc-100 px-4 py-3"><GripVertical size={18} className="hidden text-zinc-400 sm:block" /><div className="min-w-0 flex-1"><p className="font-semibold text-zinc-900">{index + 1}. {labelFor(block.type)}</p><p className="truncate text-xs text-zinc-500">{blockTypes.find((item) => item.type === block.type)?.description}</p></div><button onClick={() => move(index, -1)} disabled={index === 0} title="上移" aria-label={`上移${labelFor(block.type)}`} className={secondaryButton}><ArrowUp size={15} /></button><button onClick={() => move(index, 1)} disabled={index === page.blocks.length - 1} title="下移" aria-label={`下移${labelFor(block.type)}`} className={secondaryButton}><ArrowDown size={15} /></button><button onClick={() => updateBlock(index, { enabled: !block.enabled })} title={block.enabled ? "隱藏" : "顯示"} className={secondaryButton}>{block.enabled ? <Eye size={15} /> : <EyeOff size={15} />}</button><button onClick={() => duplicate(index)} title="複製" className={secondaryButton}><Copy size={15} /></button><button onClick={() => remove(index)} title="刪除" className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button></div>
      <BlockFields block={block} onChange={(key, value) => updateContent(index, key, value)} />
    </AdminPanel>)}</div>
    <AdminPanel className="p-5"><h2 className="text-lg font-semibold">新增區塊</h2><p className="mt-1 text-sm text-zinc-500">選擇安全的預設版型，不需要撰寫 HTML 或 CSS。</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><select value={selectedType} onChange={(e) => setSelectedType(e.target.value as PageBlockType)} className="flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm">{blockTypes.map((item) => <option key={item.type} value={item.type}>{item.label} — {item.description}</option>)}</select><button onClick={addBlock} className={primaryButton}><Plus size={16} />加入區塊</button></div></AdminPanel>
    {showHistory && <div role="dialog" aria-modal="true" aria-label="發布紀錄" className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4"><div className="mx-auto max-w-xl rounded-xl bg-white p-6"><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">發布紀錄</h2><button onClick={() => setShowHistory(false)}>關閉</button></div>{revisions.length ? revisions.slice().reverse().map((item) => <div key={item.version} className="flex items-center justify-between border-t py-3"><div><p>版本 {item.version} · {item.title}</p><p className="text-xs text-zinc-500">{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ""}</p></div><button onClick={() => void restore(item.version)} className={secondaryButton}>復原並發布</button></div>) : <p className="text-sm text-zinc-500">尚無舊版本</p>}</div></div>}
    {preview && <div role="dialog" aria-modal="true" aria-label="首頁預覽" className="fixed inset-0 z-50 bg-white"><div className="flex h-14 items-center justify-between bg-zinc-950 px-5 text-white"><span>未發布預覽 · 前台實際版型</span><button onClick={() => setPreview(false)} className="rounded bg-white px-4 py-2 text-sm text-zinc-950">返回編輯</button></div><iframe ref={previewFrame} title="首頁未發布預覽" src="/preview/home" onLoad={() => previewFrame.current?.contentWindow?.postMessage({ type: "cms-preview-page", page }, window.location.origin)} className="h-[calc(100vh-3.5rem)] w-full border-0" /></div>}
  </div>;
}

function BlockFields({ block, onChange }: { block: PageBlock; onChange: (key: string, value: unknown) => void }) {
  const value = (key: string) => typeof block.content[key] === "string" ? String(block.content[key]) : "";
  const input = (label: string, key: string, placeholder = "") => <label className="block"><span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span><input value={value(key)} placeholder={placeholder} onChange={(e) => onChange(key, e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400" /></label>;
  const textarea = (label: string, key: string) => <label className="block"><span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span><textarea value={value(key)} onChange={(e) => onChange(key, e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400" /></label>;
  if (["editorial", "hero", "about", "skills", "portfolio", "blog", "contact"].includes(block.type)) return <div className="px-5 py-4 text-sm text-zinc-500">此區塊使用網站目前的版型和內容。主視覺標題可在下方「主視覺內容設定」調整；其餘固定文案需修改網站程式。</div>;
  if (block.type === "spacer") return <div className="p-5"><label className="block"><span className="mb-1.5 block text-sm font-medium text-zinc-700">留白高度</span><select value={value("size") || "medium"} onChange={(e) => onChange("size", e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm"><option value="small">小</option><option value="medium">中</option><option value="large">大</option></select></label></div>;
  return <div className="grid gap-4 p-5 md:grid-cols-2">{block.type !== "cta" && input("小標籤", "eyebrow")}{input("標題", "title")}<div className="md:col-span-2">{textarea("內容（支援簡單 Markdown）", "body")}</div>{block.type === "image_text" && <><ImageField value={value("image_url")} onChange={(next) => onChange("image_url", next)} />{input("圖片替代文字", "image_alt")}<label className="block"><span className="mb-1.5 block text-sm font-medium text-zinc-700">圖片位置</span><select value={value("image_side") || "left"} onChange={(e) => onChange("image_side", e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm"><option value="left">左側</option><option value="right">右側</option></select></label></>}{block.type === "cta" && <>{input("按鈕文字", "button_label")}{input("按鈕連結", "button_url", "#contact 或 https://…")}</>}</div>;
}

function ImageField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file?: File) => { const token = localStorage.getItem("authToken"); if (!file || !token) return; setUploading(true); try { onChange(await uploadImage(file, token)); toast.success("圖片已上傳"); } catch (err) { toast.error(getErrorMessage(err, "圖片上傳失敗")); } finally { setUploading(false); } };
  return <label className="block md:col-span-2"><span className="mb-1.5 block text-sm font-medium text-zinc-700">圖片</span><div className="flex gap-2"><input value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm" /><span className={`${secondaryButton} cursor-pointer`}><ImageUp size={15} />{uploading ? "上傳中" : "上傳"}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} /></span></div></label>;
}
