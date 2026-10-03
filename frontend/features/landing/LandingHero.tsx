import Image from "next/image";

interface LandingHeroProps {
  title: string;
  portraitUrl: string;
}

export function LandingHero({ title, portraitUrl }: LandingHeroProps) {
  const titleWords = title.split(/\s+/);
  const firstLine = titleWords[0];
  const secondLine = titleWords.slice(1).join(" ");

  return (
    <section id="hero" className="relative min-h-[94vh] overflow-hidden bg-[#1b1c1f] text-[#f4f3ef]">
      <div className="mx-auto grid min-h-[94vh] max-w-[1500px] grid-cols-1 items-center px-6 pb-12 pt-28 md:grid-cols-[1.25fr_.75fr] md:px-10 lg:px-16">
        <div className="relative z-10 pt-14 md:pt-0">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[.32em] text-white/35">Portfolio / 2026</p>
          <h1 className="text-[clamp(4.4rem,10vw,10.5rem)] font-medium uppercase leading-[.83] tracking-[-.075em]">
            {firstLine}{secondLine && <><br />{secondLine}</>}
          </h1>
          <div className="mt-9 grid max-w-2xl gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="font-mono text-[10px] uppercase leading-[1.7] tracking-[.16em] text-white/60">
              Java / React engineer building reliable AI workflows for manufacturing and enterprise teams.
            </p>
            <a href="#portfolio" className="flex h-20 w-20 items-center justify-center rounded-full bg-[#455ce9] font-mono text-[9px] uppercase tracking-[.12em] transition-transform hover:scale-110">View work</a>
          </div>
        </div>
        <div className="relative mt-16 h-[54vh] min-h-[440px] overflow-hidden md:mt-0 md:h-[70vh]">
          <Image src={portraitUrl} alt="Angelo" fill priority className="object-cover grayscale contrast-110" sizes="(min-width:768px) 42vw,100vw" />
        </div>
      </div>
      <p className="absolute bottom-6 right-8 hidden font-mono text-[9px] uppercase tracking-[.22em] text-white/35 md:block">Scroll to explore</p>
    </section>
  );
}
