"use client";

import { useEffect, useState } from "react";
import {
  getHeroSettings,
  getSiteSettings,
  type HeroSettings,
  type SiteSettings,
} from "@/services/staticContentService";

interface LandingSettings {
  hero: HeroSettings | null;
  site: SiteSettings | null;
}

/**
 * Keeps the public landing page's two editable content sources in one place.
 * Components deliberately receive plain data so they remain easy to read and test.
 */
export function useLandingSettings(): LandingSettings {
  const [settings, setSettings] = useState<LandingSettings>({ hero: null, site: null });

  useEffect(() => {
    let cancelled = false;

    void Promise.all([getHeroSettings(), getSiteSettings()])
      .then(([hero, site]) => {
        if (!cancelled) setSettings({ hero, site });
      })
      .catch((error: unknown) => {
        // Individual services already provide their own safe fallback where possible.
        console.error("Failed to load editable landing-page content:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
