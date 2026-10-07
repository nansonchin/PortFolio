import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import SmoothScrollProvider from "./app/providers/SmoothScrollProvider.tsx";
import "lenis/dist/lenis.css"
import Cursor from "./components/Cursor/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <Cursor/>
      <RouterProvider router={router} />
    </SmoothScrollProvider>
  </StrictMode>,
);
