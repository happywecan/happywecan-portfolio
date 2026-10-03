"use client";

import { API_BASE_URL } from "@/services/apiClient";
import { LandingHero } from "@/features/landing/LandingHero";
import { NotesSection } from "@/features/landing/NotesSection";
import { PositioningSection } from "@/features/landing/PositioningSection";
import { useLandingSettings } from "@/features/landing/useLandingSettings";
import { WorkShowcase } from "@/features/landing/WorkShowcase";
import ContactSection from "./ContactSection";

const FALLBACK_PORTRAIT = `${API_BASE_URL}/static/uploads/4e0a62f8-a2e5-4eb8-9f9e-88cb0819e66c.jpg`;

/**
 * Composition root for the public landing page.
 *
 * Each visual section owns its markup, static portfolio copy lives in
 * `features/landing/landingContent.ts`, and this root only connects editable
 * API data to the sections that need it.
 */
export default function EditorialLanding() {
  const { hero, site } = useLandingSettings();

  return (
    <>
      <LandingHero
        title={hero?.hero_main_title.trim() || "Angelo Developer"}
        portraitUrl={FALLBACK_PORTRAIT}
      />
      <PositioningSection />
      <WorkShowcase portfolioTitle={site?.portfolio_title.trim() || "Selected work"} />
      <NotesSection title={site?.blog_title.trim() || "Notes from the work"} />
      <ContactSection />
    </>
  );
}
