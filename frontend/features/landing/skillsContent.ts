export type Skill = {
  name: string;
  core?: boolean;
  production?: boolean;
  project?: "rag" | "mes" | "training" | "stamping" | "translation";
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: Skill[];
};

// Only list technologies supported by the work described on this site or by
// the site's own implementation. Other tools can be added in the CMS later.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "ai",
    label: "AI / LLM",
    skills: [
      { name: "RAG", core: true, production: true, project: "rag" },
      { name: "Dify", core: true, production: true, project: "rag" },
      { name: "Azure OpenAI", core: true, production: true, project: "rag" },
      { name: "AI agents", core: true, project: "mes" },
      { name: "RAG evaluation", production: true, project: "rag" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Python", core: true },
      { name: "Java" },
      { name: "Spring Boot" },
      { name: "REST APIs", core: true },
    ],
  },
  {
    id: "data",
    label: "Data & Database",
    skills: [
      { name: "SQL", core: true, project: "mes" },
      { name: "MES", project: "mes" },
      { name: "Data processing" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    skills: [
      { name: "Docker", core: true },
      { name: "Git" },
    ],
  },
  {
    id: "automation",
    label: "Automation & Integration",
    skills: [
      { name: "Workflow automation", core: true, project: "stamping" },
      { name: "API integration" },
      { name: "Speech-to-text", project: "translation" },
      { name: "AI video workflow", project: "training" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & UI",
    skills: [
      { name: "TypeScript" },
      { name: "React" },
      { name: "Next.js" },
    ],
  },
];

export const SKILL_PROJECTS = {
  rag: { title: "企業 RAG 知識應用", href: "#case-01", context: "內部多語知識查詢與回答品質評估" },
  mes: { title: "MES 自然語言查詢驗證", href: "#case-02", context: "製造資料唯讀查詢的概念驗證" },
  training: { title: "教育訓練內容再利用", href: "#product-1", context: "簡報轉旁白影片的 AI 輔助流程" },
  stamping: { title: "電子用印流程", href: "#product-2", context: "具身分權限與操作紀錄的內部流程" },
  translation: { title: "即時翻譯", href: "#product-3", context: "公司活動的語音轉文字與翻譯流程" },
} as const;
