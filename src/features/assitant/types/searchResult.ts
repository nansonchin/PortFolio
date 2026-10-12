import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";

export type SearchResult = {
  project: ProjectAiContext;
  score: number;
  reasons: string[];
};
