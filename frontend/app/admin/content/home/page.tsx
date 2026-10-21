import PageBuilder from "@/components/admin/PageBuilder";
import HomeContentSettings from "@/components/admin/HomeContentSettings";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";
import type { CmsPage } from "@/services/pageService";

export default async function HomeContentPage() {
  let initialPage: CmsPage | undefined;
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const response = await fetch(`${apiBase}/api/pages/home`, { cache: "no-store" });
    if (response.ok) initialPage = await response.json() as CmsPage;
  } catch {
    // PageBuilder will retry from the browser if the server request fails.
  }
  return <><AdminPageHeader title="首頁內容" description="編排區塊、預覽並發布首頁。" /><PageBuilder initialPage={initialPage} /><HomeContentSettings /></>;
}
