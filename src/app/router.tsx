import MainLayout from "../layouts/MainLayout";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";

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
          { path: "contact", element: <Contact /> },
          { path: "*", element: <NotFound /> },
          {
            path: "project/:slug",
            element: <ProjectDetail />,
          },
        ],
      },
    ],
  },
]);

export default router;
