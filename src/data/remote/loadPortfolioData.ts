import { cache } from "react";
import { projectRepository } from "../../repository/ProjectRepository";
import {
  isPortfolioSnapshot,
  readZhTranslations,
  type PortfolioSnapshot,
} from "./portfolioSnapshot";

const SNAPSHOT_URL = String(import.meta.env.VITE_SNAPSHOT_URL ?? "");
const CACHE_KEY = "portfolio:snapshot:v1";

const FETCH_TIMEOUT_MS = 2500;

export type DataSource = "remote" | "cache" | "bundled";

function readCache(): PortfolioSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const data: unknown = JSON.parse(raw);
    return isPortfolioSnapshot(data) ? data : null;
  } catch {
    return null;
  }
}

function writeCache(snapshot: PortfolioSnapshot): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {}
}

async function fetchSnapshot(): Promise<PortfolioSnapshot | null> {
  try {
    const response = await fetch(SNAPSHOT_URL, { cache: "no-cache" });
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (!isPortfolioSnapshot(data)) {
      return null;
    }
    writeCache(data);
    return data;
  } catch {
    return null;
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | "timeout"> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve("timeout"), ms);

    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    });
  });
}

export async function loadPortfolioData(): Promise<DataSource> {
  if (!SNAPSHOT_URL) {
    return "bundled";
  }
  const fetched = await withTimeout(fetchSnapshot(), FETCH_TIMEOUT_MS);

  if (fetched !== "timeout" && fetched !== null) {
    projectRepository.setProjects(
      fetched.projects,
      readZhTranslations(fetched),
    );
    console.info(
      `[portfolio] data: remote — ${fetched.projects.length} projects, generated ${fetched.generatedAt}`,
    );
    return "remote";
  }
  const cached = readCache();

  if (cached) {
    projectRepository.setProjects(cached.projects, readZhTranslations(cached));
    console.info(
      `[portfolio] data: cache — ${cached.projects.length} projects, generated ${cached.generatedAt}`,
    );
    return "cache";
  }
  console.info("[portfolio] data: bundled");
  return "bundled";
}
