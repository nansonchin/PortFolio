import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "./index.css";
// import App from './App.tsx'
import { Analytics } from '@vercel/analytics/next';
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import SmoothScrollProvider from "./app/providers/SmoothScrollProvider.tsx";
import "lenis/dist/lenis.css";
import Cursor from "./components/Cursor/index.ts";
import { CursorProvider } from "./components/Cursor/CursorContext.tsx";
import { CursorPhysicsProvider } from "./components/Cursor/CursorPhysicsContext.tsx";
import TerminalAssistant from "./components/TerminalAssistant/TerminalAssistant.tsx";
import { setupAI } from "./components/Ai/provider/setupAI.ts";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import { IntroProvider } from "./components/Intro/IntroContext.tsx";
import { LanguageProvider } from "./il8n/LanguageContext.tsx";
setupAI();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <SmoothScrollProvider>
        <CursorProvider>
          <CursorPhysicsProvider>
            <IntroProvider>
              <Cursor />
              <Analytics/>
              <RouterProvider router={router} />
            </IntroProvider>
          </CursorPhysicsProvider>
        </CursorProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  </StrictMode>,
);
