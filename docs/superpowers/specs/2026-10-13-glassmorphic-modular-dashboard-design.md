# Design Specification: LEPU CSDL Tutor - Glassmorphic Modular Dashboard

**Date:** 2026-10-13  
**Status:** Approved by User  
**Target:** `lepu-csdl-tutor` (`index.html`, `assets/app.css`, `js/app.js`, `js/quiz.js`)  
**Design Standard:** Glassmorphic Modular Studio, Impeccable v4.5.2 Design System (0 anti-patterns)

---

## 1. Intent & Context

### Purpose
Redesign `lepu-csdl-tutor` from the incumbent style into a high-craft **Glassmorphic Modular Studio** tailored for students studying Database Systems (CSDL) at EPU. The workspace provides an immersive, focused study experience with dark-mode aesthetic, parallel AI tutoring, and clear modular structure for all study modes (Reader, MCQ, Flashcards, Fill-in-the-blanks, Written Exam, Notes).

### Critical Requirements & Constraints
- **Preserve Data & Features:** 100% data integrity for `data/*.md` (lesson content) and `data/qz/*.json` (exam questions, flashcards, fill-in, written questions) and existing AI proxy connectivity.
- **Eliminate AI Anti-patterns (Impeccable Compliance):**
  - No text under 11px (fix the status chip 10px bug).
  - No overused boilerplate fonts (Plus Jakarta Sans, Space Grotesk). Use system typography (`-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif`) and `JetBrains Mono` for SQL.
  - No single-side card border tells (`border-left` tabs).
  - No dated `bounce` easing. Use exponential deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Glassmorphic Tokens:** Layered dark obsidian backdrop (`#0b0b0f`), frosted glass cards (`backdrop-filter: blur(16px)`, `rgba(22, 21, 28, 0.72)`), subtle hairline borders (`rgba(255, 255, 255, 0.08)`), luminous accent indicators.

---

## 2. Layout & Component Architecture

### Three-Column Studio Workspace
```
+--------------------------------------------------------------------------------------------------+
| Top Glass Bar (52px): Logo | Breadcrumb | Lesson Selector | AI Status Chip | Theme | AI Toggle   |
+--------------------------------------------------------------------------------------------------+
| Left Dock (260px)        | Central Study Stage (Flex, max 880px)            | Right AI Dock (380px)  |
| - 6 Study Modes Nav      | - Main Document Reader (Markdown / Tables / SQL) | - Parallel Context     |
|   (Reader, MCQ, Cards,   | - MCQ Practice Studio (Glass Cards)              | - Chat Thread          |
|    Fill, Written, Notes) | - Flashcard 3D Flipper Studio                    | - Prompt Composer      |
| - Table of Contents      | - Fill-in-the-blank & Written Exam Panes         |   (Ctrl+K Shortcut)    |
|   (Auto-scrolling tree)  | - Personal Notes Manager                         |                        |
+--------------------------------------------------------------------------------------------------+
```

### 1. Top Glass Bar
- Fixed top navigation, height `52px`, `backdrop-filter: blur(20px)`.
- Left: Glass badge logo with soft glow + dynamic breadcrumb (`LEPU > CSDL > [Document Title]`).
- Center: Modular lesson selector dropdown with frosted glass flyout.
- Right: AI Status chip (latency, active model, minimum 11px font size), AI Tutor toggle button with badge, and theme switcher.

### 2. Left Dock (Navigation & Modes)
- Width: `260px`, border-right: hairline `rgba(255, 255, 255, 0.08)`.
- Mode Selector: 6 pill tabs with glass hover states and live counter pills for active question counts.
- Table of Contents: Hierarchical list of headers with smooth active tracking via IntersectionObserver.

### 3. Central Stage (Main Content Area)
- Centered container (`max-width: 880px`, margin auto).
- Markdown Document Reader:
  - Headers with clean typography hierarchy.
  - SQL Code Blocks: Custom glass wrapper with header bar, syntax label ("SQL Server / T-SQL"), and copy button.
  - Tables: Frosted data grid with subtle borders and clear column headers.
  - Callout boxes: Subtly tinted frosted containers with soft icons, no jarring left-borders.
- Practice Modes:
  - MCQ: Option cards with smooth elevation and state glow (selected / correct / incorrect).
  - Flashcards: Smooth card flipping with 3D transform and subtle glow.
  - Written Exam: Accordion format with model answers and evaluation points.

### 4. Right Dock (AI Tutor)
- Desktop: Docked side-by-side (non-overlapping), width `380px`. Can be toggled open/collapsed.
- Mobile / Small screens: Transitions to a floating glass drawer with backdrop blur and touch swipe dismissal.
- Composer: Multi-line textarea with keyboard shortcuts, quick action chips, and glowing send trigger.

---

## 3. Design Tokens (CSS Variables)

```css
:root {
  /* Canvas & Obsidian Layers */
  --bg-deep: #0b0b0f;
  --bg-ambient: radial-gradient(circle at 50% 0%, rgba(56, 48, 86, 0.15) 0%, transparent 70%);
  
  /* Glass Surfaces */
  --glass-surface: rgba(22, 21, 28, 0.72);
  --glass-surface-hover: rgba(32, 30, 40, 0.82);
  --glass-surface-active: rgba(42, 39, 54, 0.9);
  --glass-blur: blur(16px) saturate(160%);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-border-hover: 1px solid rgba(255, 255, 255, 0.18);
  --glass-border-focus: 1px solid rgba(16, 185, 129, 0.5);

  /* Shadows */
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-shadow-pop: 0 16px 48px 0 rgba(0, 0, 0, 0.55);

  /* Typography Colors */
  --text-primary: #f5f5f7;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-accent: #10b981;
  --text-accent-cyan: #06b6d4;

  /* State Tokens */
  --state-success: #10b981;
  --state-warning: #f59e0b;
  --state-danger: #ef4444;

  /* Typography Stacks */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Geometry & Motion */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-fast: 180ms var(--ease-expo);
  --transition-normal: 280ms var(--ease-expo);
}
```

---

## 4. Quality & Compliance Checklist
- [x] Run `impeccable detect` on modified files: MUST return 0 anti-patterns.
- [x] Functional text >= 11px everywhere.
- [x] No `border-left` single-edge styling on cards or tabs.
- [x] No bounce animations.
- [x] Fallback for non-supporting browsers (`@supports not (backdrop-filter: blur(1px))`).
- [x] Full mobile responsive support (Collapsible drawer for AI, hamburger navigation for sidebar).
- [x] Preserve local storage state (active lesson, dark/light theme, custom notes, quiz progress).
