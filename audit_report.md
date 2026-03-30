# Survey App — Full Audit Report

> **Date:** 30 March 2026  
> **Scope:** Full frontend + backend code review — bugs, unimplemented features, UI consistency, analytics pages, dead code.

---

## Table of Contents

1. [Critical & High-Severity Bugs](#1-critical--high-severity-bugs)
2. [Unimplemented / Dead-End Features](#2-unimplemented--dead-end-features)
3. [Survey Analytics & Results Pages — Deep Dive](#3-survey-analytics--results-pages--deep-dive)
4. [UI / Design Consistency Issues](#4-ui--design-consistency-issues)
5. [Dead / Orphaned Code](#5-dead--orphaned-code)
6. [Recommendations & Suggestions](#6-recommendations--suggestions)
7. [Prioritised Fix List](#7-prioritised-fix-list)

---

## 1. Critical & High-Severity Bugs

### 🔴 BUG-01: Material Symbols Icons Font Not Loaded

**Severity:** Critical — affects every page  
**Files:** [index.html](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/index.html)

The CSS in `index.css` defines `.material-symbols-outlined` but **no font file or CDN link is loaded anywhere** in `index.html`. The comment says "self-hosted for LAN/offline" but the `@font-face` declaration is missing. This means all Material Symbols icons render as **raw text ligature names** (e.g., the word "analytics" instead of the icon) unless the font happens to be cached from elsewhere.

**Fix:** Add an `@font-face` declaration in `index.css` pointing to a local `.woff2` file, or add a Google Fonts `<link>` in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

---

### 🔴 BUG-02: Inter Font Not Loaded

**Severity:** High — degrades typography on all pages  
**Files:** [index.css](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/index.css), [tailwind.config.js](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/tailwind.config.js)

`tailwind.config.js` sets `fontFamily.display` to `"Inter Variable"` and `index.css` sets `:root` font-family to the same — but there's no `@font-face` or CDN link loading Inter. It falls back to `system-ui`.

**Fix:** Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap" rel="stylesheet" />
```

---

### 🟠 BUG-03: Admin Dashboard — "Pending Responses" Stat Card Always Shows "—"

**Severity:** High — misleading placeholder  
**File:** [AdminDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L629-L631)

The "Pending Responses" stat card on the Admin Dashboard is hardcoded to display `—`. No data is fetched or computed.

```jsx
<p className="text-3xl font-bold mt-1">—</p>  // Line 630 — always a dash
```

---

### 🟠 BUG-04: Admin Dashboard — Trend Indicators Are Hardcoded Dashes

**Severity:** Medium — decorative lie  
**File:** [AdminDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L595-L627)

All four stat cards show `trending_up` or `trending_down` icons followed by `—`. There is no logic computing trends. This creates a misleading impression that trend tracking is broken rather than simply not implemented.

---

### 🟠 BUG-05: Survey Status Progress Bars Hardcoded to 50%

**Severity:** Medium — wrong data  
**File:** [AdminDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L947)

```jsx
<div className="h-full bg-primary w-[50%]" />  // Line 947 — hardcoded width
```

All survey status progress bars in the Admin sidebar display at 50% regardless of actual completion.

---

### 🟠 BUG-06: Teacher Dashboard — Search Input Does Nothing

**Severity:** Medium — broken UX  
**File:** [TeacherDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L161-L166)

A search bar is rendered in the Teacher Dashboard header. The `search` state is captured via `onChange`, but it's **never used to filter** any displayed data. The search bar is purely cosmetic.

---

### 🟠 BUG-07: Student Dashboard — Search Input Does Nothing

**Severity:** Medium — same issue as BUG-06  
**File:** [StudentDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L136-L141)

Same as the Teacher Dashboard — the search value is captured but never used for filtering.

---

### 🟠 BUG-08: Admin Dashboard — "Global Search" Only Filters Users

**Severity:** Medium — misleading  
**File:** [AdminDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L566)

The placeholder text says *"Global search for users, surveys or classes..."* but search only filters the Users table. Surveys and classes are not searched.

---

### 🟡 BUG-09: ResultsDashboard — Inline Styles Instead of Design System

**Severity:** Low — styling inconsistency, not a crash  
**File:** [ResultsDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/ResultsDashboard.jsx)

This page uses hardcoded `style={{}}` objects and raw colours like `#007bff`, `#f8f9fa`, `#ddd`, ignoring the Tailwind/HeroUI design system used everywhere else. It will look correct in light mode but **breaks completely in dark mode**.

---

### 🟡 BUG-10: ManageClass Page — All Inline Styles, No Dark Mode

**Severity:** Low — same issue as BUG-09  
**File:** [ManageClass.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/ManageClass.jsx)

The ManageClass page is styled entirely with `style={{}}` objects. Hardcoded colours like `#28a745`, `#f8f9fa`, `#007bff` break dark mode and look jarring next to the Tailwind-styled pages.

---

### 🟡 BUG-11: ResponseDetails Component — All Inline Styles

**Severity:** Low — same root cause  
**File:** [ResponseDetails.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/components/ResponseDetails.jsx)

Uses `style={{ border: '1px solid #ddd' }}` etc. — completely unstyled for dark mode and looks ugly with grey borders.

---

### 🟡 BUG-12: Duplicate Admin UI at `/admin` Route

**Severity:** Low — confusing UX  
**Files:** [Admin.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/Admin.jsx), [AdminDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx)

Two completely separate admin interfaces exist:

| Route | Component | Design System |
|-------|-----------|------|
| `/dashboard` (admin) | `AdminDashboard.jsx` | Custom Tailwind sidebar layout |
| `/admin` | `Admin.jsx` | HeroUI Tabs/Table layout |

Both have full user management, class management, and CSV import — but with **completely different UIs**. The MainLayout navbar shows an "Admin" link (to `/admin`) only for admin users, creating confusion about which admin panel to use.

---

## 2. Unimplemented / Dead-End Features

These are UI elements that are rendered but have **no functional code behind them**.

| # | Element | Location | Issue |
|---|---------|----------|-------|
| **F-01** | 🔔 **Notification Bell** (Admin) | [AdminDashboard.jsx:573-576](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L573-L576) | Shows a red dot implying new notifications — but the button does nothing and no notification system exists |
| **F-02** | ⚙️ **Settings Button** (Admin) | [AdminDashboard.jsx:577-579](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L577-L579) | Renders a settings gear icon — button has no `onClick`, no settings page exists |
| **F-03** | 🔍 **Filter Button** (User Table) | [AdminDashboard.jsx:641-643](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L641-L643) | "Filter" button renders but has no handler or dropdown |
| **F-04** | 📥 **Export Button** (User Table) | [AdminDashboard.jsx:644-646](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L644-L646) | "Export" button has no functionality |
| **F-05** | 📜 **"View All Activity"** button | [AdminDashboard.jsx:930](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L930) | Static text, no activity log page exists |
| **F-06** | 📋 **"Recent Activity"** sidebar | [AdminDashboard.jsx:917-931](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L917-L931) | Entire section shows placeholder text "Survey activity appears here" — no backend integration |
| **F-07** | 🔔 **Notification Bell** (Teacher) | [TeacherDashboard.jsx:170-172](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L170-L172) | Same as Admin — non-functional |
| **F-08** | 📚 **"Resources" sidebar link** (Teacher) | [TeacherDashboard.jsx:134-137](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L134-L137) | No onClick, no destination |
| **F-09** | ⚙️ **"Settings" sidebar link** (Teacher) | [TeacherDashboard.jsx:138-141](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L138-L141) | No onClick, no settings page |
| **F-10** | 🔄 **Refresh button** (Student Activity) | [TeacherDashboard.jsx:407-409](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L407-L409) | Renders a refresh icon — no handler |
| **F-11** | 📖 **"View All Activity History"** | [TeacherDashboard.jsx:437-439](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L437-L439) | Dead button, no activity history page |
| **F-12** | 💡 **"Learn more"** tip button | [TeacherDashboard.jsx:451-453](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L451-L453) | Static "Did you know?" section with a non-functional "Learn more" link |
| **F-13** | 🔔 **Notification Bell** (Student) | [StudentDashboard.jsx:144-146](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L144-L146) | Non-functional |
| **F-14** | ❓ **"Help Centre"** sidebar link | [StudentDashboard.jsx:123-126](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L123-L126) | No handler, no help page |
| **F-15** | 🏆 **Gamification elements** (Student) | [StudentDashboard.jsx:370-397](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L370-L397) | "Weekly Challenge", "View Milestones", "Redeem Points" — all hardcoded, non-functional decorative elements with no backend support |

---

## 3. Survey Analytics & Results Pages — Deep Dive

### Results Dashboard ([ResultsDashboard.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/ResultsDashboard.jsx))

> [!WARNING]
> This is the weakest page in the application. It uses completely different styling from every other page.

#### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| **A-01** | **No charts or visualisations** — results are shown as simple progress bars with percentages. No pie charts, bar charts, or heatmaps. | Design gap |
| **A-02** | **No dark mode support** — uses hardcoded colours (`#f8f9fa`, `#007bff`, `#ddd`, `#e9ecef`, `#666`) via inline styles. Dark mode shows unreadable content. | Bug |
| **A-03** | **Text question responses not displayed** — questions of type `text` have no rendering in the results summary → only MC/TF/ranking types are handled | Missing feature |
| **A-04** | **No response filtering** — can't filter by class, year level, date range, or individual student | Missing feature |
| **A-05** | **Link colour mismatch** — "Back to Dashboard" uses `#007bff` (Bootstrap blue) instead of the app's primary colour `#0f49bd` | Bug |
| **A-06** | **Export button uses HeroUI** while rest of page uses inline styles — creates visual inconsistency within the same page | Consistency |
| **A-07** | **No loading skeleton** — shows plain text "Loading results..." while data fetches, unlike other pages that use spinners/skeletons | Consistency |
| **A-08** | **ResponseDetails table** inherits the same inline-styles problem — `#f2f2f2`, `#ddd` borders look terrible in dark mode | Bug |
| **A-09** | **No real-time / auto-refresh** of results | Missing feature |
| **A-10** | **Missing completion progress ring/bar** — completion data is fetched but shown as plain text, not visualised | Design gap |

### Teacher Dashboard Analytics

- **Trend badges all show "—"** on every stat card ([TeacherDashboard.jsx L215](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L215), L225, L235, L245)
- Completion Rate stat works ✅ correctly computed from survey data
- Survey table completion bars are functional ✅

### Student Dashboard Analytics

- **Trend badge shows "—"** on the "Total Completed" card ([StudentDashboard.jsx L187-189](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L187-L189))
- **"Your Rank"** widget hardcoded to "Participant" — no ranking system exists ([L176-178](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L176-L178))
- Response Rate and survey counts are computed correctly ✅

---

## 4. UI / Design Consistency Issues

### Styling System Fragmentation

The app uses **three different styling approaches** across its pages, creating a fragmented experience:

| Approach | Pages | Problem |
|----------|-------|---------|
| **Tailwind + custom classes** | AdminDashboard, TeacherDashboard, StudentDashboard, CreateSurvey | The "new" design system — consistent |
| **HeroUI components** | LoginPage, BrowseSurveys, TakeSurvey, Admin.jsx | HeroUI's own styling — slightly different visual language |
| **Inline styles with hardcoded colours** | ResultsDashboard, ManageClass, ResponseDetails | Legacy styling — completely breaks dark mode |

### Specific Inconsistencies

| # | Issue | Files |
|---|-------|-------|
| **U-01** | **Dashboard pages use own sidebar** while non-dashboard pages use the `MainLayout` navbar — creates two completely different navigation patterns | All dashboard pages vs. BrowseSurveys/TakeSurvey/ManageClass |
| **U-02** | **Login page gradient** uses `primary-100` and `secondary-100` but `secondary` is never defined in `tailwind.config.js` — relies on HeroUI's defaults which may not match | [LoginPage.jsx:30](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/LoginPage.jsx#L30) |
| **U-03** | **ManageClass** is wrapped in `MainLayout` (navbar) while TeacherDashboard uses sidebar — clicking "Manage Roster" sends teacher from sidebar layout → navbar layout, jarring transition | [ManageClass.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/ManageClass.jsx) |
| **U-04** | **BrowseSurveys** uses HeroUI `Card` + `Chip` components but teacher/student dashboards use custom Tailwind cards — inconsistent card styling | [BrowseSurveys.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/BrowseSurveys.jsx) |
| **U-05** | **TakeSurvey** uses HeroUI `Card`/`Divider`/`Button` + uppercase title, while CreateSurvey uses custom Tailwind panel — same "survey" context, different visual language | [TakeSurvey.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TakeSurvey.jsx) vs [CreateSurvey.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/CreateSurvey.jsx) |
| **U-06** | **No theme toggle accessible** — `ThemeContext` exists with `toggleTheme` but no UI control is exposed anywhere | [ThemeContext.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/contexts/ThemeContext.jsx) |
| **U-07** | **ProtectedRoute loading state** shows plain `<div>Loading...</div>` with no styling — flash of unstyled content | [App.jsx:19](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/App.jsx#L19) |
| **U-08** | **Stat card hover/click behaviour absent** — all four stat cards on every dashboard look clickable but have no interactive behaviour | All dashboards |
| **U-09** | **Error state inconsistency** — some pages show `text-danger` (HeroUI), others show `bg-red-100 text-red-800` (Tailwind), others show `style={{ color: 'red' }}` (inline) | Throughout |

---

## 5. Dead / Orphaned Code

| # | Item | File | Issue |
|---|------|------|-------|
| **D-01** | `SharingOptions.jsx` | [SharingOptions.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/components/SharingOptions.jsx) | **Never imported** anywhere — replaced by inline sharing UI in `CreateSurvey.jsx` |
| **D-02** | `InstructionModal.jsx` | [InstructionModal.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/components/InstructionModal.jsx) | **Never imported** anywhere |
| **D-03** | `CheckboxQuestion.jsx` | [CheckboxQuestion.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/components/questions/CheckboxQuestion.jsx) | **Never imported** — no "checkbox" question type exists in `QUESTION_TYPES` |
| **D-04** | `Admin.jsx` (entire file) | [Admin.jsx](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/Admin.jsx) | Completely superseded by `AdminDashboard.jsx` — but still routed via `/admin` |
| **D-05** | `isSurveyOpen` function | [TeacherDashboard.jsx:8-14](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/TeacherDashboard.jsx#L8-L14) and [StudentDashboard.jsx:8-14](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/StudentDashboard.jsx#L8-L14) | Identical utility function duplicated in two files — should be extracted |
| **D-06** | `parseCSV` + `mapCSVRowToUser` | [Admin.jsx:30-56](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/Admin.jsx#L30-L56) and [AdminDashboard.jsx:26-52](file:///c:/Users/dsuth/Documents/Code%20Projects/School%20apps/survey-app/frontend/src/pages/AdminDashboard.jsx#L26-L52) | Exact same CSV utilities duplicated across both admin panels |
| **D-07** | `.cookies.txt`, `.login.json`, `.surveys.json` | Project root | Appear to be debug/test artefacts — should be gitignored |

---

## 6. Recommendations & Suggestions

### High Priority — Functional Fixes

1. **Load fonts properly** — Add Google Fonts links for both Inter and Material Symbols to `index.html`. This fixes BUG-01 and BUG-02 and will transform the entire look of the app.

2. **Restyle the Results Dashboard** — Rewrite `ResultsDashboard.jsx` and `ResponseDetails.jsx` to use Tailwind classes. Add dark mode support. Consider adding Chart.js or Recharts for actual data visualisations.

3. **Restyle ManageClass** — Convert all inline styles to Tailwind. Ideally, integrate it into the Teacher Dashboard sidebar layout so navigation is consistent.

4. **Remove or hide dead-end UI** — Either implement the notifications, settings, filter/export buttons, or remove them. Showing non-functional UI erodes user trust.

5. **Remove the duplicate admin panel** — Delete `Admin.jsx` and remove the `/admin` route. The `AdminDashboard.jsx` is the more polished version.

### Medium Priority — UX Improvements

6. **Wire up search bars** — The search inputs on Teacher and Student dashboards should filter the displayed surveys and classes.

7. **Compute real stat card values** — Replace all `—` trend indicators either with real data or remove the trend badge entirely if no historical data is tracked.

8. **Fix the Survey Status progress bars** — Replace the hardcoded `w-[50%]` with actual completion percentage data from the backend.

9. **Remove fake gamification** — The "Weekly Challenge", "Redeem Points", and "Your Rank" elements on the Student Dashboard have no backend. Either build the feature or remove the UI.

### Low Priority — Code Quality

10. **Extract shared utilities** — `isSurveyOpen`, `parseCSV`, `mapCSVRowToUser`, `getInitials`, `formatLastLogin` are duplicated. Create a `utils/` folder.

11. **Clean up orphaned components** — Delete `SharingOptions.jsx`, `InstructionModal.jsx`, `CheckboxQuestion.jsx`.

12. **Add a 404 route** — No catch-all route exists in the router.

13. **Expose theme toggle** — The dark mode infrastructure exists but users can't access it.

14. **Unify the navigation pattern** — Decide between sidebar layout and MainLayout navbar, and use one consistently.

---

## 7. Prioritised Fix List

> Quick-reference table for tackling these issues in order of user impact.

| Priority | Item | Type | Effort |
|----------|------|------|--------|
| **P0** | BUG-01: Load Material Symbols font | Bug | 5 min |
| **P0** | BUG-02: Load Inter font | Bug | 5 min |
| **P1** | BUG-09+10+11: Restyle Results, ManageClass, ResponseDetails for dark mode | Bug | 2–4 hrs |
| **P1** | BUG-12: Remove duplicate Admin page | Cleanup | 15 min |
| **P1** | BUG-05: Fix hardcoded 50% progress bars | Bug | 30 min |
| **P1** | BUG-03: Compute "Pending Responses" stat | Bug | 1 hr |
| **P2** | F-01/07/13: Remove or implement notification bells | Feature/Cleanup | 15 min (remove) |
| **P2** | F-15: Remove fake gamification from Student Dashboard | Cleanup | 15 min |
| **P2** | BUG-06+07: Wire up search on Teacher & Student dashboards | Bug | 1 hr |
| **P2** | BUG-04: Remove or implement trend indicators | Cleanup | 30 min |
| **P2** | D-01/02/03: Delete orphaned components | Cleanup | 10 min |
| **P3** | A-01: Add chart library for results visualisations | Feature | 3–4 hrs |
| **P3** | A-03: Display text question responses in results | Feature | 1 hr |
| **P3** | U-03: Make ManageClass use sidebar layout | Refactor | 2 hrs |
| **P3** | U-06: Add theme toggle button | Feature | 30 min |
| **P3** | D-05/06: Extract shared utilities | Refactor | 30 min |
| **P3** | Add 404 catch-all route | Feature | 10 min |
