import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";
import type { SearchResult } from "../types/searchResult";

export function searchProjects(input: string, projects:ProjectAiContext[]): SearchResult[] {
  const keyword = input.toLowerCase().split(" ").filter(Boolean);

  const results = projects.map((project) => {
    let score = 0;
    const reasons: string[] = [];

    const searchableText = [
      project.title,
      project.summary,
      project.description,
      project.category,
      ...project.technologies,
      ...project.features,
      ...project.responsibilities,
    ]
      .join(" ")
      .toLowerCase();

    keyword.forEach((word) => {
      if (searchableText.includes(word)) {
        score += 10;
        reasons.push(`matched "${word}"`);
      }
    });
    if (project.featured) {
      score += 5;
      reasons.push("featured project");
    }

    return{
        project,
        score,
        reasons,
    }
  });

  return results.filter(result=>result.score>0).sort((a,b)=>b.score - a.score)
}
