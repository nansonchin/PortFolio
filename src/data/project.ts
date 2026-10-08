import type { Project } from "../entities/Project";

export const projects: Project[] = [
  {
    id: "manga-reader",
    slug: "manga-reader",
    title: "Manga Reader",
    summary: "A high-performance manga reader build with React Query",
    description:
      "A React project using TanStack Query, infinite scrolling, image preloading, virtualized rendering, and the MangaDex Api",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/manga-webReactQuery",
    demoUrl: "",
    thumbnail: "/images/projects/mangaReader/",
    heroImage: "/images/projects/mangaReader/",
    technologies: [
      "React",
      "TypeScript",
      "TanStack Query",
      "GSAP",
      "SCSS",
      "Vite",
    ],
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-1.webp",
        title: "Home Page",
        description: "Landing page of Manga Reader.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-2.webp",
        title: "Detail Page",
        description: "Project detail screen.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-3.webp",
        title: "Reader",
        description: "Long strip reading experience.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-4.webp",
        title: "Chapter List",
        description: "Infinite chapter loading.",
      },
    ],
    features: [
      "Infinite Chapter Loading",
      "Optimized Image Rendering",
      "Reader Performance System",
    ],
    responsibilities: [
      "Frontend Architecture",
      "API Integration",
      "Performance Optimization",
    ],
    challenges: [
      "Handling large manga images",
      "Reducing unnecessary network requests",
    ],
    solutions: ["React Query caching", "Browser image cache strategy"],
  },
  {
    id: "portfolio",

    slug: "portfolio",

    title: "Developer Portfolio",

    summary: "A modern portfolio inspired by Awwwards using React and GSAP.",

    description:
      "A portfolio website featuring premium animations, reusable architecture, AI chatbot integration, GitHub synchronization and responsive design.",

    year: 2026,

    category: "Frontend",

    featured: true,

    githubUrl: "https://github.com/your-github/portfolio",

    demoUrl: "https://",
    thumbnail: "/images/projects/portfolio/",
    heroImage: "/images/projects/portfolio/",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS", "Lenis"],
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-1.webp",
        title: "Home Page",
        description: "Landing page of Manga Reader.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-2.webp",
        title: "Detail Page",
        description: "Project detail screen.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-3.webp",
        title: "Reader",
        description: "Long strip reading experience.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-4.webp",
        title: "Chapter List",
        description: "Infinite chapter loading.",
      },
    ],
    features: [
      "Infinite Chapter Loading",
      "Optimized Image Rendering",
      "Reader Performance System",
    ],
    responsibilities: [
      "Frontend Architecture",
      "API Integration",
      "Performance Optimization",
    ],
    challenges: [
      "Handling large manga images",
      "Reducing unnecessary network requests",
    ],
    solutions: ["React Query caching", "Browser image cache strategy"],
  },
  {
    id: "taskmanager-j",
    slug: "taskmanager-j",
    title: "Task Manager",

    summary:
      "A simple task manager built while revisiting React fundamentals and rebuilding my understanding of modern React development.",

    description:
      "A small React learning project created while restarting my React learning journey through Fireship's React content. The project focuses on practicing fundamental React concepts such as components, state management, event handling, list rendering, and user interactions through a simple task management application.",

    category: "Frontend",

    featured: true,

    githubUrl: "https://github.com/nansonchin/taskManagerJ",

    demoUrl: "",

    thumbnail: "/images/projects/taskManager",

    heroImage: "/images/projects/taskManager",
    year: 2026,
    technologies: ["React", "JavaScript", "Vite", "CSS"],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-1.webp",
        title: "Task Manager",
        description: "Main interface for managing tasks.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-2.webp",
        title: "Task Creation",
        description: "Interface for adding new tasks.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-3.webp",
        title: "Task Interaction",
        description: "Managing and updating tasks through React interactions.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-4.webp",
        title: "Task List",
        description: "Displaying and managing the current list of tasks.",
      },
    ],

    features: [
      "Create Tasks",
      "Display Task List",
      "Update Task State",
      "Remove Tasks",
      "React State Management",
      "Interactive UI",
      "Component-Based Architecture",
    ],

    responsibilities: [
      "Revisited React fundamentals",
      "Built reusable React components",
      "Practiced state and event handling",
      "Implemented task creation and management",
      "Practiced rendering dynamic lists",
      "Built the project using Vite",
    ],

    challenges: [
      "Rebuilding my understanding of React after struggling with the framework",
      "Understanding how React state changes affect the UI",
      "Learning how to structure a small React application into components",
      "Understanding event handling and user interactions",
      "Getting comfortable with React's component and rendering model",
    ],

    solutions: [
      "Restarted with the fundamentals instead of jumping directly into complex projects",
      "Used a small task manager as a practical project for applying React concepts",
      "Practiced breaking the interface into smaller components",
      "Used React state to manage task data and UI interactions",
      "Followed Fireship's React learning material as a guide while implementing the project",
    ],
  },
  {
    id: "Ai-resume",
    slug: "Ai-Resume",
    title: "AI Resume Analysis",

    summary:
      "A tutorial-based AI resume analysis web application built to explore React, TypeScript, PDF processing, authentication, and AI integration.",

    description:
      "A React and TypeScript resume analysis application built by following a YouTube tutorial. The project allows users to upload a resume, provide a target company, job title, and job description, and receive AI-generated feedback including an overall score, ATS score, and category-based recommendations. This project was primarily used as a learning experience to understand how modern React applications can integrate authentication, file uploads, PDF processing, cloud storage, and AI services.",

    category: "AI / Frontend",

    featured: true,

    githubUrl: "https://github.com/nansonchin/AI_Resume_Analysis",

    demoUrl: "",
    year: 2025,
    thumbnail: "/images/projects/AiResume/Thumbnail.webp",
    heroImage: "/images/projects/AiResume/Hero.webp",
    technologies: [
      "React",
      "TypeScript",
      "React Router",
      "Tailwind CSS",
      "Vite",
      "Zustand",
      "Puter.js",
      "PDF.js",
      "React Dropzone",
    ],
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/AiResume/Gallery/G1.webp",
        title: "Resume Dashboard",
        description:
          "Dashboard for viewing analyzed resumes and their generated feedback.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/AiResume/Gallery/G2.webp",
        title: "Resume Upload",
        description:
          "Upload interface for providing a resume and target job information.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/AiResume/Gallery/G3.webp",
        title: "AI Resume Analysis",
        description:
          "Resume analysis results including overall and ATS scores.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/AiResume/Gallery/G4.webp",
        title: "Feedback Details",
        description:
          "Detailed AI-generated feedback covering resume content, structure, tone, and skills.",
      },
    ],

    features: [
      "AI-Powered Resume Analysis",
      "ATS Compatibility Scoring",
      "Job Description-Based Resume Evaluation",
      "PDF Resume Upload",
      "Resume Preview",
      "Overall Resume Scoring",
      "Tone & Style Feedback",
      "Content Feedback",
      "Resume Structure Feedback",
      "Skills Analysis",
      "Improvement Suggestions",
      "Resume History",
      "User Authentication",
      "Cloud File Storage",
    ],

    responsibilities: [
      "Followed and implemented the project from a YouTube tutorial",
      "Practiced React and TypeScript development",
      "Implemented resume file upload and PDF processing",
      "Integrated AI-powered resume analysis",
      "Worked with authentication and cloud storage",
      "Built and styled the resume analysis interface",
      "Learned state management using Zustand",
      "Worked with React Router for application navigation",
    ],

    challenges: [
      "Understanding how AI services can be integrated into a React application",
      "Learning how PDF files can be processed and displayed in the browser",
      "Understanding the flow between file upload, AI processing, and stored results",
      "Working with authentication and cloud-based application services",
      "Understanding how structured AI responses can be displayed in reusable React components",
    ],

    solutions: [
      "Followed the tutorial implementation step by step while studying how each part of the application worked",
      "Used PDF.js to understand PDF processing and resume previews",
      "Used React Dropzone to handle resume file uploads",
      "Used Zustand to practice client-side state management",
      "Used React Router to organize application routes",
      "Used Puter.js to learn about authentication, storage, and AI service integration",
    ],
  },
  {
    id: "gsap_mojito",
    slug: "Gsap_mojito",
    title: "GSAP Mojito",

    summary:
      "A tutorial-based React project created to learn GSAP animations and interactive web motion.",

    description:
      "A React project built by following a YouTube tutorial focused on creating an animated Mojito landing page. The main goal of the project was to learn how to integrate GSAP with React and understand techniques for creating smooth, timeline-based animations, scroll interactions, transitions, and engaging UI motion.",

    category: "Frontend / Animation",

    featured: true,

    githubUrl: "https://github.com/nansonchin/Gsap_Mojito",

    demoUrl: "",

    thumbnail: "/images/projects/Mojito/thumbnail.webp",

    heroImage: "/images/projects/Mojito/hero.webp",
    year: 2025,
    technologies: ["React", "TypeScript", "GSAP", "Vite"],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/Mojito/Gallery/G1.webp",
        title: "Mojito Landing Page",
        description:
          "Animated landing page built as part of the GSAP learning project.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/Mojito/Gallery/G2.webp",
        title: "Product Section",
        description:
          "Interactive product section with animated visual elements.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/Mojito/Gallery/G3.webp",
        title: "Animated Sections",
        description:
          "Page sections demonstrating GSAP-powered transitions and motion.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/Mojito/Gallery/G4.webp",
        title: "Responsive Layout",
        description:
          "Responsive React layout combined with animated UI interactions.",
      },
      {
        id: "gallery-5",
        imageUrl: "/images/projects/Mojito/Gallery/G5.webp",
        title: "Responsive Layout",
        description:
          "Responsive React layout combined with animated UI interactions.",
      },
    ],

    features: [
      "GSAP Animations",
      "Timeline-Based Animations",
      "Scroll-Based Animations",
      "Animated Page Transitions",
      "Interactive UI Elements",
      "Responsive Landing Page",
      "Smooth Visual Transitions",
    ],

    responsibilities: [
      "Followed the project from a YouTube tutorial",
      "Practiced integrating GSAP with React",
      "Learned GSAP animation timelines",
      "Implemented animated UI interactions",
      "Practiced coordinating multiple animations",
      "Worked with responsive React layouts",
    ],

    challenges: [
      "Understanding how GSAP works alongside React's component lifecycle",
      "Learning how to coordinate multiple animations using GSAP timelines",
      "Understanding animation sequencing and timing",
      "Managing animated elements without interfering with React rendering",
      "Learning how to create smoother and more engaging user interactions",
    ],

    solutions: [
      "Followed the tutorial implementation while studying the purpose of each GSAP animation",
      "Practiced using GSAP timelines to control animation sequences",
      "Used React refs to target DOM elements for animation",
      "Experimented with animation timing, easing, and transitions",
      "Applied the learned animation techniques to different sections of the page",
    ],
  },
  {
    id: "gsap_award",
    slug: "Gsap_award",
    title: "GSAP Award Winning",

    summary:
      "A tutorial-based React project created to explore advanced GSAP animations, page transitions, and interactive web experiences.",

    description:
      "A React project built by following a YouTube tutorial focused on creating an award-style interactive website. The project was used as a learning exercise to explore advanced GSAP animation techniques, smooth page transitions, scroll-based interactions, animated UI elements, and the process of building a visually engaging frontend experience.",

    category: "Frontend / Animation",

    featured: true,
    year: 2025,
    githubUrl: "https://github.com/nansonchin/Gsap_Award_Winning",

    demoUrl: "",

    thumbnail: "/images/projects/GsapAward/thumbnail.webp",

    heroImage: "/images/assets/projects/GsapAward/hero.webp",

    technologies: ["React", "TypeScript", "GSAP", "Vite"],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/GsapAward/Gallery/G1.webp",
        title: "Interactive Landing Page",
        description:
          "Visually focused landing page built to explore advanced web animation techniques.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/GsapAward/Gallery/G2.webp",
        title: "Animated Sections",
        description:
          "Page sections enhanced with GSAP-powered transitions and interactive motion.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/GsapAward/Gallery/G3.webp",
        title: "Scroll Animations",
        description:
          "Scroll-based animations used to create a more dynamic browsing experience.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/GsapAward/Gallery/G4.webp",
        title: "Page Transitions",
        description:
          "Animated transitions connecting different sections of the interactive experience.",
      },
      {
        id: "gallery-5",
        imageUrl: "/images/projects/GsapAward/Gallery/G5.webp",
        title: "Page Transitions",
        description:
          "Animated transitions connecting different sections of the interactive experience.",
      },
      {
        id: "gallery-6",
        imageUrl: "/images/projects/GsapAward/Gallery/G6.webp",
        title: "Page Transitions",
        description:
          "Animated transitions connecting different sections of the interactive experience.",
      },
    ],

    features: [
      "Advanced GSAP Animations",
      "Scroll-Based Animations",
      "Page Transitions",
      "Interactive UI Elements",
      "Animation Timelines",
      "Smooth Visual Transitions",
      "Responsive Layout",
    ],

    responsibilities: [
      "Followed the project from a YouTube tutorial",
      "Practiced advanced GSAP techniques",
      "Implemented animation timelines",
      "Worked with scroll-based interactions",
      "Practiced creating page transitions",
      "Integrated GSAP animations into React components",
    ],

    challenges: [
      "Understanding more complex GSAP animation sequences",
      "Coordinating multiple animations across different sections",
      "Understanding scroll-based animation behavior",
      "Integrating animation logic with React components",
      "Maintaining smooth transitions while creating visually complex interactions",
    ],

    solutions: [
      "Followed the tutorial while studying how each animation was structured",
      "Used GSAP timelines to coordinate complex animation sequences",
      "Practiced using React refs to control DOM elements",
      "Experimented with animation timing, easing, and sequencing",
      "Applied GSAP techniques to create smoother page and scroll interactions",
    ],
  },
  {
    id: "mika_pikazo",
    slug: "Mika_pikazo",
    title: "Mika Pikazo",
    year: 2025,
    summary:
      "A self-designed artist portfolio website built with React and TypeScript, featuring responsive layouts, artwork presentation, routing, and a full-stack application structure.",

    description:
      "A personal artist portfolio website inspired by Mika Pikazo's visual style and artwork. I designed and developed the project myself using React, TypeScript, and Vite, focusing on creating a visually driven browsing experience for presenting artwork and artist information. The project also explores full-stack web development through a separate Express server, database integration, authentication-related functionality, and API communication.",

    category: "Full Stack",

    featured: true,

    githubUrl: "https://github.com/nansonchin/mikaPikazo",

    demoUrl: "",

    thumbnail: "/images/projects/Mika/thumbnail.webp",

    heroImage: "/images/projects/Mika/hero.webp",

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Express",
      "Node.js",
      "PostgreSQL",
      "Axios",
      "JWT",
      "bcrypt",
      "React Router",
      "Swiper",
    ],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/Mika/Gallery/G1.webp",
        title: "Artist Landing Page",
        description:
          "A visually focused landing page designed around the artist's artwork and visual identity.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/Mika/Gallery/G2.webp",
        title: "Artwork Showcase",
        description:
          "Artwork-focused interface for presenting visual content in an organized portfolio layout.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/Mika/Gallery/G3.webp",
        title: "Portfolio Experience",
        description:
          "Responsive portfolio sections combining artwork, navigation, and supporting content.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/Mika/Gallery/G4.webp",
        title: "Interactive Content",
        description:
          "Interactive content presentation using routing and carousel-based UI components.",
      },
      {
        id: "gallery-5",
        imageUrl: "/images/projects/Mika/Gallery/G5.webp",
        title: "Interactive Content",
        description:
          "Interactive content presentation using routing and carousel-based UI components.",
      },
      {
        id: "gallery-6",
        imageUrl: "/images/projects/Mika/Gallery/G6.webp",
        title: "Interactive Content",
        description:
          "Interactive content presentation using routing and carousel-based UI components.",
      },
      {
        id: "gallery-7",
        imageUrl: "/images/projects/Mika/Gallery/G7.webp",
        title: "Interactive Content",
        description:
          "Interactive content presentation using routing and carousel-based UI components.",
      },
    ],

    features: [
      "Artist Portfolio Website",
      "Responsive Design",
      "Artwork Showcase",
      "React-Based UI",
      "Client-Side Routing",
      "Interactive Image Sliders",
      "API Communication",
      "Backend Server",
      "Database Integration",
      "Authentication Infrastructure",
    ],

    responsibilities: [
      "Designed the website from scratch",
      "Developed the frontend using React and TypeScript",
      "Structured the application using reusable components",
      "Implemented responsive layouts",
      "Built the artist and artwork presentation interface",
      "Implemented client-side routing",
      "Integrated frontend API communication",
      "Worked with the Express backend",
      "Explored PostgreSQL database integration",
      "Implemented authentication-related functionality",
    ],

    challenges: [
      "Turning a strong visual concept into a functional web interface",
      "Balancing artwork presentation with usability and navigation",
      "Building a responsive layout around image-heavy content",
      "Connecting the React frontend with a backend server",
      "Working with database and authentication infrastructure",
      "Managing both frontend and backend concerns within the same project",
    ],

    solutions: [
      "Structured the frontend into reusable React components",
      "Used responsive layouts to adapt the artwork presentation across screen sizes",
      "Used React Router to organize application navigation",
      "Used Axios for communication between the frontend and backend",
      "Used Express to provide the server-side application structure",
      "Used PostgreSQL for database connectivity",
      "Used JWT and bcrypt as part of the authentication infrastructure",
      "Used Swiper for interactive artwork/content presentation",
    ],
  },
  {
    id: "komori-met",
    slug: "Komori_met",
    title: "Komori Met Landing Page",

    summary:
      "A simple landing page project built to practice React UI development and interactive frontend components.",

    description:
      "A small landing page project created as a practical exercise in building a React-based user interface. The project focuses on presenting content through a simple visual layout while practicing interactive frontend elements such as navigation, icons, and image sliders.",

    year: 2023,

    category: "Frontend",

    featured: false,

    githubUrl: "https://github.com/nansonchin/KomoriMet-React",

    demoUrl: "",

    thumbnail: "/images/projects/KomoriM/thumbnail.webp",

    heroImage: "/images/projects/KomoriM/thumbnail.webp",

    technologies: ["React", "JavaScript", "Swiper", "Font Awesome"],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/KomoriM/Gallery/G1.webp",
        title: "Landing Page",
        description:
          "Main landing page presenting the site's content and visual design.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/KomoriM/Gallery/G2.webp",
        title: "Content Section",
        description:
          "Content-focused section demonstrating the page layout and structure.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/KomoriM/Gallery/G3.webp",
        title: "Image Slider",
        description: "Interactive content presentation using Swiper.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/KomoriM/Gallery/G4.webp",
        title: "UI Elements",
        description: "Simple interface elements using Font Awesome icons.",
      },
    ],

    features: [
      "Responsive Landing Page",
      "Interactive Image Slider",
      "Swiper Carousel",
      "Font Awesome Icons",
      "React UI Components",
      "Simple Content Presentation",
    ],

    responsibilities: [
      "Built the landing page interface",
      "Structured the React UI",
      "Implemented interactive content sections",
      "Integrated Swiper for slider functionality",
      "Integrated Font Awesome icons",
      "Practiced frontend layout and component development",
    ],

    challenges: [
      "Building a clean layout while keeping the project simple",
      "Understanding how interactive UI components work in React",
      "Integrating a third-party slider library into the page",
      "Organizing the page into reusable frontend sections",
    ],

    solutions: [
      "Used React components to structure the interface",
      "Integrated Swiper for interactive slider functionality",
      "Used Font Awesome for reusable interface icons",
      "Kept the project focused on simple and maintainable frontend implementation",
    ],
  },
  {
    id: "slotmachine",
    slug: "Slotmachine",
    title: "Slot Machine",
    year: 2025,
    summary:
      "A small interactive slot machine game created as a fun experiment with React and AI-assisted development.",

    description:
      "A small browser-based slot machine game created as a fun side project while exploring interactive development with React. I used AI as a development partner to discuss the idea, explore possible implementations, and work through the game logic. The project gave me an opportunity to experiment with React state, user interactions, conditional rendering, and basic game logic in a simple and enjoyable project.",

    category: "Frontend / Game",

    featured: false,

    githubUrl: "https://github.com/nansonchin/Slotmachine",

    demoUrl: "",

    thumbnail: "/images/projects/mangaReader",

    heroImage: "/images/projects/mangaReader",

    technologies: ["React", "JavaScript", "Vite"],

    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/slot-machine/gallery-1.webp",
        title: "Slot Machine",
        description: "Main game interface for the browser-based slot machine.",
      },

      {
        id: "gallery-2",
        imageUrl: "/images/projects/slot-machine/gallery-2.webp",
        title: "Game Interaction",
        description:
          "Interactive interface for starting and playing the slot machine.",
      },

      {
        id: "gallery-3",
        imageUrl: "/images/projects/slot-machine/gallery-3.webp",
        title: "Game Result",
        description:
          "Displays the result after the slot machine completes a spin.",
      },

      {
        id: "gallery-4",
        imageUrl: "/images/projects/slot-machine/gallery-4.webp",
        title: "Game Interface",
        description: "Simple game-focused UI built with React.",
      },
    ],

    features: [
      "Interactive Slot Machine",
      "Randomized Game Results",
      "Game State Management",
      "User Interaction",
      "Dynamic UI Updates",
      "Browser-Based Gameplay",
    ],

    responsibilities: [
      "Came up with the idea for the project",
      "Used AI to discuss and explore the implementation",
      "Built the interface using React",
      "Implemented the game interaction and logic",
      "Managed game state and UI updates",
      "Experimented with interactive frontend development",
    ],

    challenges: [
      "Turning a simple idea into a working interactive game",
      "Understanding how to manage game state in React",
      "Handling random game outcomes",
      "Keeping the game logic simple while making the interaction enjoyable",
      "Using AI effectively as a development and problem-solving partner",
    ],

    solutions: [
      "Used React state to manage the changing game values",
      "Implemented randomized results for each game interaction",
      "Used conditional rendering to update the UI based on the game state",
      "Discussed implementation approaches with AI before refining the code",
      "Kept the project small so I could focus on experimenting with React and game logic",
    ],
  },
];
