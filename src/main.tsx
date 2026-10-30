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
import { Analytics } from "@vercel/analytics/react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import SmoothScrollProvider from "./app/providers/SmoothScrollProvider.tsx";
import "lenis/dist/lenis.css";
import Cursor from "./components/Cursor/index.ts";
import { CursorProvider } from "./components/Cursor/CursorContext.tsx";
import { CursorPhysicsProvider } from "./components/Cursor/CursorPhysicsContext.tsx";
import TerminalAssistant from "./components/TerminalAssistant/TerminalAssistant.tsx";
import { setupAI } from "./components/Ai/provider/setupAI.ts";
import { IntroProvider } from "./components/Intro/IntroContext.tsx";
import { LanguageProvider } from "./il8n/LanguageContext.tsx";
import { SharedImageProvider } from "./components/PageTransition/SharedImageContext.tsx";
setupAI();

// if ("scrollRestoration" in window.history) {
//   window.history.scrollRestoration = "manual";
// }
// window.scrollTo(0, 0);

const isTouch = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <SmoothScrollProvider>
        <CursorProvider>
          <CursorPhysicsProvider>
            <IntroProvider>
              <SharedImageProvider>
                <Analytics />
                <div className={isTouch ? "" : "cursor-none"}>
                  {!isTouch && <Cursor />}
                  <RouterProvider router={router} />
                </div>
              </SharedImageProvider>
            </IntroProvider>
          </CursorPhysicsProvider>
        </CursorProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  </StrictMode>,
);
