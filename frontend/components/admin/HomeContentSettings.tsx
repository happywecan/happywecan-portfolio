"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const HeroContentForm = dynamic(() => import("./HeroContentForm"), {
  loading: () => <p className="text-sm text-zinc-500">正在載入主視覺設定…</p>,
});

export default function HomeContentSettings() {
  const [open, setOpen] = useState(false);
  return (
    <details className="mt-8 rounded-xl border border-zinc-200 bg-white p-5" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="cursor-pointer font-semibold">主視覺內容設定</summary>
      {open && <div className="mt-5"><HeroContentForm /></div>}
    </details>
  );
}
