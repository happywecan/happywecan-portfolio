import HomePageRenderer from "@/components/sections/HomePageRenderer";
import type { CmsPage } from "@/services/pageService";
import type { HeroSettings } from "@/services/staticContentService";

export default async function Home() {
  let initialPage: CmsPage | undefined;
  let initialHero: HeroSettings | null = null;
  try {
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const [pageResponse, heroResponse] = await Promise.allSettled([
      fetch(`${apiBase}/api/pages/home`, { cache: "no-store" }),
      fetch(`${apiBase}/api/settings/hero`, { cache: "no-store" }),
    ]);
    if (pageResponse.status === "fulfilled" && pageResponse.value.ok) initialPage = await pageResponse.value.json() as CmsPage;
    if (heroResponse.status === "fulfilled" && heroResponse.value.ok) initialHero = await heroResponse.value.json() as HeroSettings;
  } catch {
    // The renderer keeps the existing homepage available while the API is down.
  }
  return <HomePageRenderer initialPage={initialPage} initialHero={initialHero} />;
}
