# ACES CMS — Content Management System

> **Branch: `CMS2`** — Academic Year **2026 – 27**

A production-ready, full-stack Content Management System for the **ACES (Association of Computer Engineering Students)** club at PVGCOET. Built with **React 19**, **Vite**, and **Tailwind CSS 4.3**, featuring a live REST API backend, authentication, a real-time omnisearch bar, and a two-tone **Purple & White / Deep Midnight** glassmorphic UI.

---

## ✨ Feature Highlights

### 🎨 Dual-Theme System
| Theme | Description |
| --- | --- |
| **Purple & White** (Light) | Clean violet canvas (`#faf5ff`), frosted white cards, high-contrast black text, `#7c3aed` purple primary accents |
| **Deep Midnight** (Dark) | Obsidian dark background with glowing indigo/violet glass panels and neon accent highlights |

Toggle between themes with a single click in the top header (or press `Cmd/Ctrl + K` to open the search palette).

---

### 🧭 Sidebar Navigation — 7 Core Modules

| # | Module | Route Key | Description |
|---|--------|-----------|-------------|
| 1 | **Launchpad** | `dashboard` | Analytics overview, member & event stats, quick-action bar |
| 2 | **Member Hub** | `members` | Full member directory with search, team filters, sort, and profile modals |
| 3 | **Fee Verification** | `fee-verification` | Registration payment review, receipt inspection, verify/flag controls |
| 4 | **Event Lineup** | `events` | Event scheduling, status tracking, grid/list view toggle |
| 5 | **Forms Engine** | `forms` | Custom form builder, response collection, CSV export |
| 6 | **Announcements** | `announcements` | Public broadcast notices, API-backed lifecycle management |
| 7 | **Media Showcase** | `showcase` | Multimedia albums, gallery collections, PDF viewer, media upload |

> **Admin Governance Panel** is accessible via the profile dropdown or Member Hub toolbar (restricted to `admin` role only).

---

## 🔌 Live Backend API Integration

All modules connect to a live REST API. When the backend is offline, the system automatically falls back to rich demo data — no crashes or blank screens.

| Service Module | API Object | Key Endpoints |
|---|---|---|
| Members | `membersApi` | `GET /members`, `POST /members`, `PATCH /members/:id`, `DELETE /members/:id` |
| Events | `eventsApi` | `GET /events`, `POST /events`, `PATCH /events/:id`, `DELETE /events/:id` |
| Announcements | `announcementsApi` | `GET /announcements`, `POST /announcements`, `DELETE /announcements/:id` |
| Forms | `formsApi` | `GET /forms`, `POST /forms`, `GET /forms/:id/responses`, `POST /forms/:id/submit` |
| Fee / Membership | `membershipApi` | `GET /membership`, `POST /membership/verify`, `POST /membership/import` |
| Media Gallery | `galleryApi` | `GET /gallery/showcase`, `POST /gallery/items`, `DELETE /gallery/items/:id` |
| File Upload | `uploadToCloudinary` | Cloudinary CDN upload with folder/resource-type routing |

---

## 🧩 Component Inventory (46 Components)

### Views (Page-Level)
- `DashboardView` — Launchpad with member/event stats and quick-action cards
- `MembersView` — Searchable, filterable member directory
- `AdminPanelView` — Admin Governance Panel with role management & account status toggles
- `FeeVerificationView` — Payment reconciliation hub with status filters, audit trail
- `EventsView` — Event scheduling hub with grid/list modes
- `FormsView` — Form directory, response viewer, and CSV export
- `AnnouncementsView` — Broadcast feed with topic/description composer
- `ShowcaseView` — Media album gallery with collection navigator
- `MagazineView` — Club magazine publications archive
- `GalleryView` — Legacy multimedia view with carousel and masonry wall
- `LoginPage` — Standalone authentication page

### Modals
- `MemberModal` — Add/Edit member profile (social links, team, position)
- `MemberDetailModal` — Read-only member inspector with official brand icons
- `RegisterMemberModal` — New member registration form
- `BatchRegisterModal` — Bulk Google Sheets import for members
- `OnboardingModal` — Token-gated account activation flow
- `ProfileModal` — Logged-in user profile & settings
- `EventModal` — Create/edit event with registration date range
- `EventDetailModal` — Event inspector with schedule & RSVP info
- `FormBuilderModal` — Drag-and-drop style form schema builder (supports image questions, payment QR)
- `FormSubmitModal` — Public form submission UI
- `VerifyFeeModal` — Receipt inspector with verify/flag/reject controls
- `ConfirmVerifyModal` — Confirmation dialog for fee verification actions
- `AddMembershipModal` — Manual membership registration entry
- `ImportMembershipModal` — CSV/spreadsheet import for fee records
- `ShowcaseItemModal` — Add/edit media item in a collection
- `ShowcaseRenameModal` — Rename media collection
- `ShowcasePdfModal` — In-app PDF viewer for showcase items
- `AddMediaModal` — Media upload modal with Cloudinary integration
- `MagazineModal` — Add/edit magazine publication
- `MagazinePdfModal` — Magazine PDF viewer
- `MediaDetailModal` — Media item inspector
- `MediaPreviewModal` — Fullscreen media preview overlay
- `LoginModal` — Inline login modal

### Shared / Utility
- `SidebarNavigation` — Fixed 7-tab navigation rail with mobile off-canvas drawer
- `TopHeader` — Sticky top bar: Omnisearch, theme toggle, auth controls, notifications
- `ThemeSelector` — Light/Dark mode toggle button
- `SocialIcons` — Official brand SVG vectors (LinkedIn, GitHub, Instagram, X/Twitter, Globe)
- `StatCard` — Reusable glassmorphic statistics card
- `MemberCard` — Member directory grid card with social links and quick actions
- `EventCard` — Event card with status/mode badges and timestamps
- `ActiveMembersPieCard` — Animated pie chart for active vs. inactive members
- `Toast` — Ephemeral success/error/info notification system
- `NotificationDrawer` — Slide-in notification drawer
- `PropertiesPanel` — Form builder properties side panel
- `MediaViewer` — Inline media renderer

---

## 🔐 Authentication & Role System

| Role | Access Level |
|---|---|
| `admin` | Full access including Admin Governance Panel — can assign/revoke roles, activate/suspend accounts |
| `team_admin` | Elevated access — can manage members and events |
| All other roles | Standard member access to public CMS views |

- JWT-based authentication via the backend API.
- Auto-detect `?onboard_token=` and `?form_id=` URL parameters for deep linking.
- Session persists in local storage; logout clears session cleanly.

---

## 🔍 Global Omnisearch

- Trigger with **`Ctrl + K`** (Windows/Linux) or **`Cmd + K`** (Mac), or click the search bar in the top header.
- Searches **Members**, **Events**, **Forms**, **Fee Records**, and **Announcements** simultaneously.
- Results appear in a live dropdown categorized by module.
- Clicking a result navigates directly to that module and opens the relevant detail modal.

---

## 📱 Responsive Design

- **Desktop (lg+)**: Fixed sidebar + content area with full padding.
- **Tablet / Mobile**: Sidebar collapses to an off-canvas drawer toggled by the hamburger button in the top header.
- No horizontal scrollbars on any view — all panels use fluid responsive CSS grids.

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/ACES-PVGCOET/aces-cms.git
cd aces-cms
git checkout CMS2

# 2. Install dependencies
npm install

# 3. Run local development server (http://localhost:5173)
npm run dev

# 4. Build production bundle
npm run build
```

### Environment / Backend
The app auto-detects the backend at runtime via `src/services/api.js`. If no backend is reachable, it falls back to local demo data gracefully. To connect a live backend, update the `BASE_URL` in `src/services/api.js`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (SPA) + Vite 8 |
| **Styling** | Tailwind CSS 4.3 (`@tailwindcss/vite`) |
| **Icons** | Lucide React + Custom brand SVGs (`SocialIcons.jsx`) |
| **Typography** | Plus Jakarta Sans & Inter (Google Fonts) |
| **State Management** | Custom React Hooks (`useMembers`, `useEvents`, `useForms`, `useMembership`, `useAnnouncements`, `useShowcase`, `useMagazines`) |
| **File Uploads** | Cloudinary CDN via `uploadToCloudinary` |
| **Build Output** | `dist/` — `~681 kB` JS bundle, `~136 kB` CSS |
| **Deployment** | Vercel (SPA rewrites configured in `vercel.json`) |

---

## 📁 Project Structure

```
aces-cms/
├── public/
├── src/
│   ├── components/        # 46 React components
│   ├── hooks/             # Custom data hooks per module
│   ├── services/
│   │   └── api.js         # REST API client + Cloudinary uploader
│   ├── App.jsx            # Root app: routing, state, modal orchestration
│   ├── App.css            # Global design tokens, glassmorphic theme variables
│   └── main.jsx
├── vercel.json            # SPA routing rewrites
└── vite.config.js
```

---

## 📋 Recent Changes (CMS2 Branch)

| Commit | Summary |
|---|---|
| `e00b7a5` | **Purple & White** light theme — `#faf5ff` canvas, `#7c3aed` accents, high-contrast black text |
| `7a7b8e6` | Updated light theme accents |
| `f8ac6f1` | Form Builder: max file size increased to 100 MB |
| `d3a2ea8` | Payment acceptance question type with QR display & screenshot upload |
| `c4a2279` | Fee Verification Hub: audit modal, registration import, receipt inspector |
| `4ef48f7` | Media preview modal; improved form response data visibility |
| `4b15e4a` | Responsive mobile sidebar drawer; hidden scrollbars across nav and data views |
| `6ac1286` | Authentication, global API services, extended module management |

---

*ACES CMS — PVGCOET · Academic Year 2026 – 27*
