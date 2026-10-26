"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Boxes, Braces, Database, GitBranch, Layers3, Sparkles, Star } from "lucide-react";
import { editorialText, type EditorialCopy } from "./editorialCopy";
import { SKILL_GROUPS, SKILL_PROJECTS, type Skill } from "./skillsContent";

const groupIcons = [Sparkles, Braces, Database, Boxes, GitBranch, Layers3];
const groupColors = ["#7759c5", "#3877a5", "#58815b", "#a36a41", "#b05b76", "#4c78a8"];

export function SkillsExplorer({ copy }: { copy?: EditorialCopy }) {
  const [category, setCategory] = useState("all");
  const [coreOnly, setCoreOnly] = useState(false);
  const [productionOnly, setProductionOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const groups = useMemo(() => SKILL_GROUPS.map((group) => {
    const label = editorialText(copy, `skill_group_${group.id}_label`, group.label);
    const list = editorialText(copy, `skill_group_${group.id}_tags`, group.skills.map((skill) => skill.name).join(" · "));
    const coreNames = editorialText(copy, `skill_group_${group.id}_core`, group.skills.filter((skill) => skill.core).map((skill) => skill.name).join(" · ")).split("·").map((name) => name.trim().toLowerCase());
    const productionNames = editorialText(copy, `skill_group_${group.id}_production`, group.skills.filter((skill) => skill.production).map((skill) => skill.name).join(" · ")).split("·").map((name) => name.trim().toLowerCase());
    const skills = list.split("·").map((name) => name.trim()).filter(Boolean).map((name) => {
      const original = group.skills.find((skill) => skill.name.toLowerCase() === name.toLowerCase());
      return { ...original, name, core: coreNames.includes(name.toLowerCase()), production: productionNames.includes(name.toLowerCase()) } as Skill;
    });
    return { ...group, label, skills };
  }), [copy]);

  const visible = groups.flatMap((group) => group.skills
    .filter(() => category === "all" || category === group.id)
    .filter((skill) => !coreOnly || skill.core)
    .filter((skill) => !productionOnly || skill.production)
    .map((skill) => ({ ...skill, groupId: group.id, groupLabel: group.label })));
  const chosen = visible.find((skill) => `${skill.groupId}:${skill.name}` === selected);
  const project = chosen?.project ? SKILL_PROJECTS[chosen.project] : null;

  return (
    <div className="mt-9">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#3d4940]">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={coreOnly} onChange={(event) => { setCoreOnly(event.target.checked); setSelected(null); }} className="size-4 accent-[#486d50]" />
          核心技能
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={productionOnly} onChange={(event) => { setProductionOnly(event.target.checked); setSelected(null); }} className="size-4 accent-[#486d50]" />
          正式環境使用
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="技能分類篩選">
        {[{ id: "all", label: "全部" }, ...groups].map((group) => (
          <button key={group.id} type="button" aria-pressed={category === group.id} onClick={() => { setCategory(group.id); setSelected(null); }}
            className={`min-h-9 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${category === group.id ? "bg-[#202a23] text-white" : "bg-[#f0f2ef] text-[#657067] hover:bg-[#e6ebe5]"}`}>
            <span data-cms-field={group.id === "all" ? undefined : `skill_group_${group.id}_label`}>{group.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-2.5" aria-live="polite">
        {visible.map((skill) => {
          const index = SKILL_GROUPS.findIndex((group) => group.id === skill.groupId);
          const Icon = groupIcons[index];
          const key = `${skill.groupId}:${skill.name}`;
          return (
            <button key={key} type="button" data-cms-field={`skill_group_${skill.groupId}_tags`} aria-pressed={selected === key} onClick={() => setSelected(selected === key ? null : key)}
              className={`relative inline-flex min-h-12 items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7656] ${selected === key ? "border-[#719679] shadow-sm" : "border-[#dfe5df]"}`}>
              <Icon aria-hidden="true" size={17} strokeWidth={2} style={{ color: groupColors[index] }} />
              <span>{skill.name}</span>
              {skill.core && <Star aria-label="核心技能" size={12} fill="#d68188" stroke="#d68188" className="absolute -right-1.5 -top-1.5" />}
            </button>
          );
        })}
        {visible.length === 0 && <p className="py-5 text-sm text-[#6d776e]">這個篩選條件下沒有技能。請切換分類或取消篩選。</p>}
      </div>

      {chosen && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d9e2d8] bg-[#f7faf6] p-5" role="status">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#68816c]">{chosen.groupLabel}{chosen.core ? " · 核心技能" : ""}{chosen.production ? " · 正式環境使用" : ""}</p>
            <h3 className="mt-1 text-lg font-semibold">{chosen.name}</h3>
            <p className="mt-1 text-sm text-[#657268]">{project ? `${project.title}：${project.context}。` : "目前沒有可公開的對應案例。"}</p>
          </div>
          {project && <a href={project.href} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#cbd9cb] bg-white px-4 text-sm font-semibold hover:bg-[#edf3ec]">
            查看相關工作<ArrowUpRight size={15} aria-hidden="true" />
          </a>}
        </div>
      )}
      <p className="mt-6 text-xs leading-5 text-[#79857a]">星號表示核心技能。「正式環境使用」僅列入已導入工作的技術，概念驗證不計入。</p>
    </div>
  );
}
