import { LandingHero } from "@/features/landing/LandingHero";
import { NotesSection } from "@/features/landing/NotesSection";
import { PositioningSection } from "@/features/landing/PositioningSection";
import { WorkShowcase } from "@/features/landing/WorkShowcase";
import type { HeroSettings, SiteSettings } from "@/services/staticContentService";
import ContactSection from "./ContactSection";

export default function EditorialLanding({ hero, site }: { hero: HeroSettings | null; site: SiteSettings | null }) {
  return (
    <>
      <LandingHero settings={hero} />
      <PositioningSection />
      <WorkShowcase portfolioTitle={site?.portfolio_title?.trim() || "Selected work"} />
      <NotesSection title={site?.blog_title?.trim() || "Notes from the work"} />
      <ContactSection />
    </>
  );
}
