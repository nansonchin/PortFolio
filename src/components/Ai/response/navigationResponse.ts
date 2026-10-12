import type { SearchResult } from "../../../features/assitant/types/searchResult";

type NavigationResponseArgs = {
  result: SearchResult;
  toolMessage: string;
};

export function buildNavigationResponse({
  result,
  toolMessage,
}: NavigationResponseArgs) {
  return `
I found ${result.project.title}.


Why this project matches:


${result.reasons.map((reason) => `✓ ${reason}`).join("\n")}


${toolMessage}
`;
}
