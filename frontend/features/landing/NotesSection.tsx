import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface NotesSectionProps {
  title: string;
}

export function NotesSection({ title }: NotesSectionProps) {
  return (
    <section id="blog" className="min-h-[62vh] bg-[#101113] px-6 py-28 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-4xl font-semibold uppercase tracking-tight md:text-6xl">{title}</h2>
        <p className="mb-14 max-w-2xl font-mono text-[10px] uppercase leading-6 tracking-[.16em] text-white/45">
          Case studies that explain the problem, architecture, trade-offs, validation, and what changed after release.
        </p>
        <Link href="/blog" className="group grid items-center border-y border-white/10 py-8 md:grid-cols-[.1fr_1fr_.2fr]">
          <span className="font-mono text-[9px] text-white/25">01</span>
          <div>
            <h3 className="text-3xl font-semibold tracking-tight">AI workflow, beyond the demo</h3>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-[.15em] text-white/30">Architecture / evaluation / rollout</p>
          </div>
          <span className="mt-4 flex items-center justify-end gap-3 font-mono text-[8px] uppercase tracking-[.18em] text-white/30 md:mt-0">
            Read notes <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
