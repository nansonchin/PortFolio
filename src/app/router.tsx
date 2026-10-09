import { Home } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
        ],
      },
      {
        path: "project/:slug",
        element: <ProjectDetail />,
      },
    ],
  },
]);

export default router