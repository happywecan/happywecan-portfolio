export const CASE_STUDIES = [
  {
    number: "01",
    accentClassName: "bg-[#c4e94e]",
    label: "Enterprise · Murata",
    title: "Enterprise RAG knowledge platform",
    body: "A governed knowledge workflow that turns internal material into searchable answers with source-aware retrieval, role-based access, and a usable delivery path for real teams.",
    tags: "RAG / Java API / MongoDB / Access control",
  },
  {
    number: "02",
    accentClassName: "bg-[#ff6244]",
    label: "Manufacturing data",
    title: "MES text-to-SQL agent",
    body: "A safer path from natural-language questions to inspectable data queries and visual answers—designed to keep people in control of business-critical manufacturing data.",
    tags: "LLM / SQL / MES / Human review",
  },
] as const;

export const PRODUCTS = [
  ["AI learning studio", "A full-stack learning platform with searchable internal material, notes, quizzes, and transcripts."],
  ["Secure e-stamping", "Batch document stamping with approval rules, auditability, certificate encryption, and SSO-aware access."],
  ["Real-time translation", "A context-aware internal translation workflow that reduces friction across Taiwanese and Japanese teams."],
] as const;

export const OPERATING_PRINCIPLES = [
  "Translate manufacturing workflows into usable system boundaries",
  "Use AI to accelerate delivery, then verify through tests, reviews, and observability",
  "Ship maintainable Java services and React interfaces—not one-off demos",
  "Document trade-offs so a team can operate and improve the system",
] as const;

export const DELIVERY_STAGES = [
  ["Build", "Java services, React interfaces, API contracts, data models"],
  ["Verify", "Tests, reviews, failure paths, access boundaries, release checks"],
  ["Operate", "Docker, CI/CD, logs, health checks, documentation, iteration"],
] as const;

export const STACK_SUMMARY = [
  ["Java + Spring Boot", "Service foundation"],
  ["React + Next.js", "Product interface"],
  ["AI / MLOps mindset", "Safe delivery"],
] as const;
