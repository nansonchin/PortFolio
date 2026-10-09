import type { ProjectArchitectureModel } from "../models/ProjectArchitectureModel";

export const mangaReaderArchitecture: ProjectArchitectureModel = {
  title: "Manga Reader Architecture",

  description:
    "Architecture design behind a high performance manga reading system.",

  root: {
    id: "manga-reader",

    title: "Manga Reader",

    children: [
      {
        id: "data-layer",

        title: "Data Layer",

        description: "Responsible for fetching and managing manga data.",

        children: [
          {
            id: "mangadex",

            title: "MangaDex API",
          },

          {
            id: "tanstack-query",

            title: "TanStack Query",
          },
        ],
      },

      {
        id: "logic-layer",

        title: "Logic Layer",

        children: [
          {
            id: "custom-hooks",

            title: "Custom Hooks",
          },

          {
            id: "reader-state",

            title: "Reader State",
          },
        ],
      },

      {
        id: "render-layer",

        title: "Rendering Layer",

        children: [
          {
            id: "virtualization",

            title: "Virtualization",
          },

          {
            id: "image-pipeline",

            title: "Image Pipeline",
          },
        ],
      },

      {
        id: "ui-layer",

        title: "UI Layer",

        children: [
          {
            id: "reader-ui",

            title: "Reader Interface",
          },
        ],
      },
    ],
  },
};
