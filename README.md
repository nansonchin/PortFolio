<!-- README.md -->

# Chin Portfolio

> Frontend Developer portfolio with an AI assistant — built with React, TypeScript, GSAP and Google Gemini.

🔗 **Live:** https://chin-portfolio-02.vercel.app

---

## Highlights

- **JARVIS** — an AI assistant (Google Gemini) that can answer questions about the portfolio and navigate to any page or project on command.
- **NieR:Automata-inspired UI** — black and gold, CRT scan lines, glitch effects, custom cursor with magnetic buttons.
- **GSAP animations** — boot screen, masked title reveals, scroll parallax, Flip grid transitions.
- **Secure by design** — Gemini API key lives server-side (Vercel Function). The browser never touches Google directly.

---

## Tech Stack

| Layer | Stack |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Animation | GSAP (ScrollTrigger, Flip), Lenis |
| AI | Google Gemini (via server-side proxy) |
| Deployment | Vercel (static + serverless function) |

---

## JARVIS Architecture

```
Browser (Terminal UI)
    │  POST /api/chat  { messages }   ← no key, no system prompt
    ▼
Vercel Function  /api/chat
    │  ① rate limit  ② sanitise input  ③ attach system prompt + tools
    ▼
Google Gemini API
    │  text reply  OR  tool call (navigate / open link)
    ▼
Browser executes tool (React Router navigate, window.open)
    │
    ▼
Gemini confirms → final text reply shown in Terminal
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file (never committed)
cp .env.example .env.local
# Fill in GEMINI_API_KEY in .env.local

# 3. Generate the server-side prompt (run after changing project data)
npm run gen:server

# 4. Start dev server (runs gen:server automatically)
npm run dev
```

> **Note:** `api/_generated.ts` must be committed — it contains the pre-built system prompt that the Vercel Function uses. Run `npm run gen:server` whenever you update project data, then commit the result.

---

## Project Structure

```
├── api/
│   ├── chat.ts           # Vercel serverless function (Gemini proxy)
│   ├── _guard.ts         # Rate limiting, input sanitisation, origin check
│   └── _generated.ts     # Auto-generated: system prompt + tool declarations
├── scripts/
│   └── generate-server-data.ts  # Builds _generated.ts from src data
├── src/
│   ├── components/
│   │   ├── Ai/           # JARVIS: provider, chat service, tools, prompt
│   │   ├── Intro/        # Boot screen
│   │   ├── TerminalAssistant/
│   │   └── ...
│   ├── data/             # Project data, developer context, profile
│   ├── hooks/            # useTerminal, useReveal, useSEO, ...
│   └── pages/
└── public/
    ├── og-image.png      # 1200×630 Open Graph share image
    └── favicon.svg
```

---

## Adding a Project

1. Add a new entry to `src/data/project.ts`.
2. Run `npm run gen:server` to rebuild the JARVIS system prompt.
3. Commit both files.
4. Push — Vercel auto-deploys.

---

## Licence

Personal portfolio — source code available for reference. Please do not deploy as your own portfolio without modification.