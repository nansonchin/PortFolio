import type {
  DeveloperContextTranslation,
  ProfileTranslation,
  ProjectTranslation,
} from "../localize";

export const profileZh: ProfileTranslation = {
  headline: ["我构建界面", "我钻研设计"],
  intro: [
    "我是一名前端开发者，拥有 IT 文凭，也有一点 UI/UX 设计背景。我喜欢设计与工程之间的那片空间：快速、结构清晰的界面。",
    "最近我在把 React、TypeScript 和 GSAP 与 AI 集成结合起来。这个作品集就是概念验证：访客只需要让 JARVIS 带路，就能去任何地方。",
  ],
  status: "开放合作",
  skillGroupTitles: {
    Frontend: "前端",
    Motion: "动效",
    "Data & Tooling": "数据与工具",
    AI: "AI",
  },
};

export const developerContextZh: DeveloperContextTranslation = {
  role: "前端开发者",
  background: ["IT 文凭", "前端开发", "UI/UX 设计经验"],
  goals: ["构建高性能的前端应用", "学习 AI 集成", "改进系统架构"],
};

/* key = project.slug. This is ONE example; copy the block for every slug. */
export const projectsZh: Record<string, ProjectTranslation> = {
  "manga-reader": {
    summary: "基于 React Query 构建的高性能漫画阅读器",
    description:
      "一个 React 项目，使用 TanStack Query、无限滚动、图片预加载、虚拟化渲染，并接入 MangaDex API。",
    features: ["无限章节加载", "优化的图片渲染", "阅读器性能系统"],
    responsibilities: ["前端架构", "API 集成", "性能优化"],
    gallery: {
      "gallery-1": { title: "首页", description: "Manga Reader 的落地页。" },
      "gallery-2": { title: "详情页", description: "项目详情界面。" },
      "gallery-3": { title: "阅读器", description: "长条漫画阅读体验。" },
      "gallery-4": { title: "章节列表", description: "无限章节加载。" },
    },
    architecture: {
      title: "Manga Reader 架构",
      description:
        "分层架构，将漫画数据、应用逻辑、渲染和用户界面的职责分开。",
      nodes: {
        "manga-reader": {
          description: "用于浏览和阅读漫画的 Web 应用。",
        },
        "data-layer": {
          title: "数据层",
          description: "获取并管理远程数据。",
        },
      },
    },
  },
};