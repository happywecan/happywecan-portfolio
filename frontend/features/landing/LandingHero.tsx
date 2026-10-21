import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "@/services/apiClient";
import { DEFAULT_HERO_SETTINGS, type HeroSettings } from "@/services/staticContentService";

interface LandingHeroProps {
  settings: HeroSettings | null;
}

const FALLBACK_PORTRAIT = `${API_BASE_URL}/static/uploads/4e0a62f8-a2e5-4eb8-9f9e-88cb0819e66c.jpg`;

function imageUrl(value?: string) {
  const url = value?.trim();
  if (!url || url === "/placeholder.svg" || url === "/placeholder.jpg") return null;
  if (url.startsWith("/static/")) return `${API_BASE_URL}${url}`;
  return url;
}

export function LandingHero({ settings }: LandingHeroProps) {
  const hero = settings ?? DEFAULT_HERO_SETTINGS;
  const title = hero.hero_main_title?.trim() || DEFAULT_HERO_SETTINGS.hero_main_title;
  const subtitle = hero.hero_subtitle?.trim() || DEFAULT_HERO_SETTINGS.hero_subtitle;
  const bio = hero.hero_bio_content?.trim() || DEFAULT_HERO_SETTINGS.hero_bio_content;
  const portfolioLabel = hero.hero_button_1_label?.trim() || DEFAULT_HERO_SETTINGS.hero_button_1_label;
  const contactLabel = hero.hero_button_2_label?.trim() || DEFAULT_HERO_SETTINGS.hero_button_2_label;
  const backgroundUrl = imageUrl(hero.hero_background_image_url);
  const portraitUrl = imageUrl(hero.hero_personal_photo_url) || FALLBACK_PORTRAIT;
  const titleWords = title.split(/\s+/);
  const firstLine = titleWords[0];
  const secondLine = titleWords.slice(1).join(" ");

  return (
    <section id="hero" className="relative min-h-[94vh] overflow-hidden bg-[#1b1c1f] text-[#f4f3ef]">
      {backgroundUrl && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image src={backgroundUrl} alt="" fill loading="eager" className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c1f]/95 via-[#1b1c1f]/80 to-[#1b1c1f]/55" />
        </div>
      )}
      <div className="relative mx-auto grid min-h-[94vh] max-w-[1500px] grid-cols-1 items-center px-6 pb-12 pt-28 md:grid-cols-[1.25fr_.75fr] md:px-10 lg:px-16">
        <div className="relative z-10 pt-14 md:pt-0">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[.32em] text-white/50">Portfolio / 2026</p>
          <h1 className="text-[clamp(4.4rem,10vw,10.5rem)] font-medium uppercase leading-[.83] tracking-[-.075em]">
            {firstLine}{secondLine && <><br />{secondLine}</>}
          </h1>
          <p className="mt-9 max-w-2xl text-xl font-medium leading-snug tracking-tight text-white md:text-2xl">{subtitle}</p>
          <div className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 [&_p+p]:mt-3">
            <ReactMarkdown>{bio}</ReactMarkdown>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#portfolio" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#455ce9] px-6 py-3 font-mono text-[11px] tracking-[.08em] transition-transform hover:scale-105">{portfolioLabel}</a>
            <a href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/45 px-6 py-3 font-mono text-[11px] tracking-[.08em] transition-colors hover:bg-white hover:text-[#1b1c1f]">{contactLabel}</a>
          </div>
        </div>
        <div className="relative mt-16 h-[54vh] min-h-[440px] overflow-hidden md:mt-0 md:h-[70vh]">
          <Image src={portraitUrl} alt="Angelo" fill priority className="object-cover grayscale contrast-110" sizes="(min-width:768px) 42vw,100vw" />
        </div>
      </div>
      <p className="absolute bottom-6 right-8 hidden font-mono text-[9px] uppercase tracking-[.22em] text-white/50 md:block">Scroll to explore</p>
    </section>
  );
}
