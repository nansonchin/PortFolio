import { projectRepository } from "../../repository/ProjectRepository";

export type BootLineKind = "header" | "task" | "file" | "verify" | "final";

export type BootLine = {
  id: string;
  kind: BootLineKind;
  text: string;
  status?: string;
};

const MAX_FILE_LINES = 4;

export function collectBootFiles(): string[] {
  const unique = new Set<string>();

  projectRepository.getFeatures().forEach((project) => {
    const src = project.thumbnail;

    if (src && !src.endsWith("/")) unique.add(src);
  });

  return [...unique];
}

function shortPath(path: string): string {
  const short = path.split("/").filter(Boolean).slice(-2).join("/");
  return short.length > 30 ? `...${short.slice(-29)}` : short;
}

export function buildBootLines(files: string[]): BootLine[] {
  const total = projectRepository.getAll().length;

  const fileLines: BootLine[] = files
    .slice(0, MAX_FILE_LINES)
    .map((path, i) => ({
      id: `file-${i}`,
      kind: "file",
      text: `File: ${shortPath(path)}`,
      status: "OK",
    }));

  return [
    { id: "boot", kind: "header", text: "PORTFOLIO_OS // SYSTEM BOOT" },
    { id: "mount", kind: "task", text: "mounting /projects", status: "OK" },
    { id: "fonts", kind: "task", text: "loading typefaces", status: "OK" },
    {
      id: "index",
      kind: "task",
      text: `indexing ${total} projects`,
      status: "OK",
    },
    ...fileLines,
    { id: "assets", kind: "task", text: "checking assets", status: "OK" },
    { id: "verify", kind: "verify", text: "verifying user", status: "??" },
    {
      id: "jarvis",
      kind: "task",
      text: "initializing JARVIS",
      status: "ONLINE",
    },
    { id: "access", kind: "task", text: "access level: VISITOR" },
    { id: "final", kind: "final", text: "Report: JARVIS standing by." },
  ];
}
