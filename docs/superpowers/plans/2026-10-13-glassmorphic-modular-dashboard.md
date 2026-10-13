# LEPU CSDL Tutor - Glassmorphic Modular Dashboard Implementation Plan

> **For agentic workers:** Native execution in this session (per user preference: no multi-agent CLI, direct execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `lepu-csdl-tutor` into a high-craft Glassmorphic Modular Dashboard for EPU database study, with 0 Impeccable anti-patterns, parallel AI dock, and refined dark-mode study stages.

**Architecture:** Refactor CSS variables to modular frosted glass tokens (`backdrop-filter: blur(16px)` + hairline borders `rgba(255,255,255,0.08)` + obsidian canvas), rebuild `index.html` structure into a clean 3-column studio layout, enhance UI components for 6 study modes, and update JS interactions.

**Tech Stack:** Vanilla HTML5, CSS3 Glassmorphism tokens, Vanilla JS (ES6 modules), Impeccable Design Quality Detector.

**Spec:** `docs/superpowers/specs/2026-10-13-glassmorphic-modular-dashboard-design.md`

## Global Constraints
- Preserve 100% data compatibility with `data/*.md` and `data/qz/*.json`.
- Zero Impeccable anti-patterns (`impeccable detect` must pass with 0 warnings).
- Minimum functional UI text size is 11px.
- No `border-left` single-edge tabs or cards.
- No bounce easing; use `cubic-bezier(0.16, 1, 0.3, 1)`.

## Review Focus
1. Status chip typography >= 11px and clean indicator dot.
2. Glassmorphic fallback for environments without `backdrop-filter`.
3. 3-column layout on desktop and responsive drawer on mobile (<768px).
4. SQL code blocks styled with high-contrast JetBrains Mono and copy button.
5. AI tutor dock collapsible without disturbing central reading scroll position.

---

### Task 1: Rebuild Glassmorphic Design Token System in CSS

**Files:**
- Modify: `assets/app.css`

- [ ] **Step 1: Replace legacy tokens with glassmorphic obsidian tokens**
Update `:root` and `[data-theme="light"]` variables with `--bg-deep`, `--glass-surface`, `--glass-blur`, `--glass-border`, `--radius-lg`, typography font stacks.

- [ ] **Step 2: Remove anti-pattern styles (border-left card tabs, bounce keyframes)**
Remove lines with `border-left: 2px solid` and bounce animations.

- [ ] **Step 3: Verify token compilation and syntax**
Check CSS validity and run preliminary check.

- [ ] **Step 4: Commit**
`git commit -m "style: implement glassmorphic tokens and clean legacy anti-patterns"`

---

### Task 2: Restructure Top Bar & 3-Column Shell in HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Refactor header into Top Glass Bar with updated font links**
Include JetBrains Mono and clean modern system fonts, upgrade status chip to 11px text.

- [ ] **Step 2: Structure Left Dock, Central Study Stage, and Right AI Dock**
Organize main layout into semantic sections with appropriate ARIA roles and data attributes.

- [ ] **Step 3: Commit**
`git commit -m "feat(layout): restructure 3-column modular glass studio shell"`

---

### Task 3: Style Modular Components for All 6 Study Modes

**Files:**
- Modify: `assets/app.css`

- [ ] **Step 1: Style Left Dock (modes pill bar + ToC tree with scroll indicator)**
- [ ] **Step 2: Style Central Stage (Reader, SQL blocks, Tables, MCQ cards, Flashcards 3D flipper)**
- [ ] **Step 3: Style Right AI Dock (Glass header, chat bubble hierarchy, composer)**
- [ ] **Step 4: Commit**
`git commit -m "style: enhance modular components for 6 study modes and ai dock"`

---

### Task 4: Enhance Client Scripts & Responsive Controls

**Files:**
- Modify: `js/app.js`
- Modify: `js/quiz.js`

- [ ] **Step 1: Update AI panel dock toggle logic and active document tracking**
- [ ] **Step 2: Ensure responsive drawer toggle for mobile devices**
- [ ] **Step 3: Commit**
`git commit -m "feat(js): improve ai dock toggle and mobile drawer support"`

---

### Task 5: Impeccable Quality Audit & End-to-End Verification

**Files:**
- Verify: `index.html`, `assets/app.css`, `js/app.js`

- [ ] **Step 1: Run `impeccable detect` on all modified files**
Verify 0 anti-patterns returned.

- [ ] **Step 2: Test rendering via browser / local server**
Verify 6 study modes, layout switching, and dark mode contrast.

- [ ] **Step 3: Final commit and summary**
`git commit -m "feat: complete glassmorphic modular dashboard redesign"`
