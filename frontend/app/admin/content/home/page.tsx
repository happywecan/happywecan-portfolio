import PageBuilder from "@/components/admin/PageBuilder";
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
  return <><AdminPageHeader title="首頁內容" description="點選網站畫面中的區塊，直接修改內容並即時預覽。" /><PageBuilder initialPage={initialPage} /></>;
}
