# ACES CMS — Interactive Content Management System

A sleek, modern, and high-performance Content Management System (CMS) frontend built for the **ACES (Association of Computer Engineering Students)** club for **Academic Year 2026 - 2027**.

Built with **React 19**, **Vite**, and **Tailwind CSS 4.3** with a **Multi-Theme Glassmorphism design aesthetic**.

---

## ✨ Key Features & Architecture

- **5 Aesthetic Themes with Instant Switcher**:
  1. **Pastel Aura** (Default): Soft pastel ambient mesh blending pale lavender/purple, mint green, and peach/yellow.
  2. **Obsidian Cyber** (Dark Mode): Deep obsidian dark background with glowing neon violet, electric cyan, and cyber glass cards.
  3. **Sunset Aurora**: Warm coral rose, golden apricot, and warm violet sunset gradient radiance.
  4. **Emerald Oasis**: Fresh botanical mint, jade, and deep forest crystal glass.
  5. **Oceanic Sapphire**: Maritime azure, cyan breeze, and sky indigo.

- **10+ Core Modular Components**:
  1. `SidebarNavigation`: Fixed left-side navigation rail (Launchpad, Member Hub, Event Lineup, Media Gallery, Announcements).
  2. `TopHeader`: Global search bar, interactive Theme Selector popover, real-time notifications drawer trigger, Admin profile, and public website sync.
  3. `DashboardView` (Launchpad): Welcome hero banner for Academic Year 2026-2027, 3 statistics cards (**Active Members displays strictly numeric value without subtext**), upcoming spotlight card ("Dino's Leaf Party"), and quick actions panel.
  4. `MembersView`: Directory hub with 3 stats, search/filter, sort selector, and clickable team tabs (`All Teams`, `Web Team`, `Leaders`, `Design & Production`, `QA`, `Devops`, `Mobile`).
  5. `MemberCard`: Grid card with avatar, role, team badge, social links (Instagram, LinkedIn, GitHub), and actions.
  6. `MemberModal`: Interactive form modal for adding/updating member profiles with validation.
  7. `EventsView`: Event management with 3 stats, search, status dropdown, mode dropdown, and grid/list view toggle.
  8. `EventCard`: Event card with timestamps, mode badge (Online/Offline/Hybrid), status badge, and RSVP progress.
  9. `EventModal`: Interactive modal to schedule and edit events.
  10. `GalleryView`: Creative multimedia module with **Horizontal Momentum Carousel** and **Vertical Masonry Wall** scrolling, category filters, and high-res lightbox video player.
  11. `AnnouncementsView`: Marketing team placeholder section with feature roadmap and broadcast simulator.
  12. `StatCard`: Reusable glassmorphic stat card with pure numeric display support.
  13. `ThemeSelector`: Glassmorphic theme switcher with gradient swatch previews and local persistence.

- **Plug-and-Play Backend API Architecture**:
  - Decoupled custom React hooks (`useMembers`, `useEvents`, `useGallery`, `useAnnouncements`, `useStats`).
  - LocalStorage caching with initial mock datasets.
  - `websiteConnector.js` adapter for exporting sanitized JSON bundles and syncing directly to the main ACES public website.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 (SPA) + Vite
- **Styling**: Tailwind CSS 4.3 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **Icons**: Lucide React
- **Design Tokens**: Plus Jakarta Sans & Inter typography
- **Theme Engine**: 5 Presets with dynamic glassmorphic tokens
