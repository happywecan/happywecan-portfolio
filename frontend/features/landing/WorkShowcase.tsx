import { CASE_STUDIES, DELIVERY_STAGES, PRODUCTS } from "./landingContent";

interface WorkShowcaseProps {
  portfolioTitle: string;
}

export function WorkShowcase({ portfolioTitle }: WorkShowcaseProps) {
  return (
    <section id="skills" className="bg-[#151714] px-6 py-24 text-[#f1f0ea] md:px-10 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[.55fr_1fr]">
          <p className="pt-3 font-mono text-[9px] uppercase tracking-[.26em] text-[#a7c84b]">
            Engineering approach<br />
            <span className="text-white/30">AI-assisted, human-owned</span>
          </p>
          <h2 className="text-[clamp(3.6rem,7vw,7rem)] font-medium uppercase leading-[.84] tracking-[-.065em]">
            From<br />prototype<br />to production.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-3">
          {DELIVERY_STAGES.map(([title, body], index) => (
            <article key={title} className="border-b border-white/10 pb-7 md:border-b-0 md:pr-6">
              <p className="font-mono text-[9px] tracking-[.22em] text-[#a7c84b]">0{index + 1}</p>
              <h3 className="mt-4 text-2xl font-semibold uppercase">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/50">{body}</p>
            </article>
          ))}
        </div>

        <div id="portfolio" className="mt-20 border-t border-white/10 pt-6">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/30">Portfolio</p>
          <h2 className="mt-3 text-4xl font-semibold uppercase tracking-tight md:text-6xl">{portfolioTitle}</h2>
        </div>
        <div className="mt-8 grid border-t border-white/10 md:grid-cols-2">
          {CASE_STUDIES.map((item) => (
            <article key={item.number} className="border-b border-white/10 py-10 md:border-r md:px-8 first:pl-0 last:border-r-0">
              <div className={`mb-14 h-1 w-8 ${item.accentClassName}`} />
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/30">
                {item.number} / {item.label}
              </p>
              <h3 className="mt-5 text-3xl font-semibold uppercase leading-[.95] tracking-[-.04em]">{item.title}</h3>
              <p className="mt-6 max-w-md text-sm leading-6 text-white/55">{item.body}</p>
              <p className="mt-8 font-mono text-[8px] uppercase tracking-[.15em] text-white/30">{item.tags}</p>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/30">Products / Platforms / Automation</p>
          <h3 className="mt-3 text-3xl font-semibold uppercase">More products shipped.</h3>
          <div className="mt-6 grid border-l border-t border-white/10 md:grid-cols-3">
            {PRODUCTS.map(([title, body]) => (
              <article key={title} className="min-h-56 border-b border-r border-white/10 p-6">
                <h4 className="text-sm font-semibold uppercase">{title}</h4>
                <p className="mt-5 text-xs leading-5 text-white/45">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
