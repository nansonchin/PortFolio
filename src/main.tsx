import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import SmoothScrollProvider from "./app/providers/SmoothScrollProvider.tsx";
import "lenis/dist/lenis.css";
import Cursor from "./components/Cursor/index.ts";
import { CursorProvider } from "./components/Cursor/CursorContext.tsx";
import { CursorPhysicsProvider } from "./components/Cursor/CursorPhysicsContext.tsx";
import TerminalAssistant from "./components/TerminalAssistant/TerminalAssistant.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <CursorProvider>
        <CursorPhysicsProvider>
          <div className="cursor-none">
            <Cursor />
            <RouterProvider router={router} />
            <TerminalAssistant/>
          </div>
        </CursorPhysicsProvider>
      </CursorProvider>
    </SmoothScrollProvider>
  </StrictMode>,
);
