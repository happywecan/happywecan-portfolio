export function projectDescription(title: string, description?: string) {
  if (title === "智慧點餐助手" && description?.includes("還沒˙有agent")) {
    return "以智慧點餐情境探索 AI agent 工作流程的早期概念驗證。";
  }
  return description;
}
