import { CheckCircle2 } from "lucide-react";
import { OPERATING_PRINCIPLES, STACK_SUMMARY } from "./landingContent";

export function PositioningSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#f2f0e9] px-6 py-24 text-[#17181a] md:px-10 lg:py-32">
      <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#dcff62]/40 blur-3xl" />
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 font-mono text-[9px] uppercase tracking-[.28em] text-[#758f2d]">
          01 / Positioning · Taiwan
        </p>
        <div className="grid gap-12 md:grid-cols-[1.35fr_.75fr]">
          <div>
            <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-medium uppercase leading-[.86] tracking-[-.065em]">
              AI features.<br />Engineered<br />to operate.
            </h2>
            <div className="mt-9 grid gap-6 border-t border-black/15 pt-5 sm:grid-cols-2">
              <p className="font-mono text-[11px] font-semibold uppercase">
                Manufacturing<br />AI / DX<br />
                <span className="font-normal text-black/40">From workflow to release</span>
              </p>
              <p className="text-sm leading-6 text-black/65">
                I turn operational problems into production-minded software: clear requirements,
                secure APIs, useful interfaces, AI workflows, and a practical path for teams to own what ships.
              </p>
            </div>
          </div>
          <div className="border-t border-black/15 pt-5">
            <p className="font-mono text-[9px] uppercase tracking-[.22em] text-black/40">How I work</p>
            <ul className="mt-4">
              {OPERATING_PRINCIPLES.map((principle) => (
                <li key={principle} className="flex gap-3 border-b border-black/10 py-4 text-sm leading-6 text-black/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#758f2d]" />
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 grid border-t border-black/15 sm:grid-cols-3">
          {STACK_SUMMARY.map(([value, label]) => (
            <div key={value} className="border-b border-black/15 py-6 sm:border-r sm:px-6 first:pl-0 last:border-r-0">
              <p className="text-2xl font-semibold uppercase">{value}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-black/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
