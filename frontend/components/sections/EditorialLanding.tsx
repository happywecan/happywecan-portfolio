import { LandingHero } from "@/features/landing/LandingHero";
import { NotesSection } from "@/features/landing/NotesSection";
import { PositioningSection } from "@/features/landing/PositioningSection";
import { WorkShowcase } from "@/features/landing/WorkShowcase";
import type { HeroSettings, SiteSettings } from "@/services/staticContentService";
import ContactSection from "./ContactSection";
import type { EditorialCopy } from "@/features/landing/editorialCopy";
import { experienceTitle } from "@/features/landing/landingContent";

export default function EditorialLanding({ hero, site, copy }: { hero: HeroSettings | null; site: SiteSettings | null; copy?: EditorialCopy }) {
  return (
    <>
      <LandingHero settings={hero} copy={copy} />
      <PositioningSection copy={copy} settings={hero} integrated />
      <WorkShowcase mode="portfolio" portfolioTitle={experienceTitle(site?.portfolio_title)} copy={copy} integrated />
      <WorkShowcase mode="skills" portfolioTitle={experienceTitle(site?.portfolio_title)} copy={copy} />
      <NotesSection title={site?.blog_title?.trim() || "Notes from the work"} copy={copy} />
      <ContactSection copy={copy} />
    </>
  );
}
