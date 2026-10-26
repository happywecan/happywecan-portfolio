export const CASE_STUDIES = [
  {
    number: "01",
    accentClassName: "bg-[#c4e94e]",
    label: "Enterprise AI",
    title: "企業 RAG 知識應用",
    body: "建置內部多語知識查詢應用，並建立回答品質的評估流程。",
    tags: "Dify / Azure OpenAI / RAG / Evaluation",
  },
  {
    number: "02",
    accentClassName: "bg-[#ff6244]",
    label: "Manufacturing data",
    title: "MES 自然語言查詢驗證",
    body: "驗證以自然語言查詢製造資料的概念，保留唯讀存取與查詢控制。",
    tags: "AI agent / SQL / MES / Proof of concept",
  },
] as const;

export const PRODUCTS = [
  ["教育訓練內容再利用", "將簡報轉成旁白影片的 AI 輔助流程，交付使用者測試。"],
  ["電子用印流程", "建立具身分權限與操作紀錄的內部 PDF 處理流程。"],
  ["即時翻譯", "為公司活動提供語音轉文字與翻譯流程。"],
] as const;

export function experienceTitle(value?: string) {
  const title = value?.trim();
  return !title || /^selected work$/i.test(title) ? "工作經驗" : title;
}

export function experienceNavLabel(value?: string) {
  const label = value?.trim();
  return !label || /^(work|portfolio)$/i.test(label) ? "Experience" : label;
}
