# Daily Journal — Digital Diary, Mindful Writing Sanctuary & Admin Brand Studio

A modern, distraction-free **Daily Journal / Digital Diary** application built with **React.js 19, Vite, Tailwind CSS v4, Laravel 13, and SQLite / MySQL (XAMPP)**. Designed to blend the warmth of a personal diary, the structure of Notion, and the administrative power of a customizable digital publishing platform.

---

## 📖 Table of Contents

- [Overview & Philosophy](#overview--philosophy)
- [Key Features](#key-features)
- [Journal Styles & Templates](#journal-styles--templates)
- [Admin Portal & Brand Studio](#admin-portal--brand-studio)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Database Architecture](#database-architecture)
- [REST API Architecture](#rest-api-architecture)
- [Installation & Quick Start](#installation--quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Laravel)](#backend-setup-laravel)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Demo & Admin Credentials](#demo--admin-credentials)
- [Running Feature Tests](#running-feature-tests)
- [Security & Authorization](#security--authorization)

---

## Overview & Philosophy

Daily Journal is created specifically for calm, intentional daily journaling combined with complete administrative brand control:
- The **journal is always the primary focus**: Clean, distraction-free writing canvas with rich text formatting and no UI clutter.
- **10 Purpose-Built Journal Templates**: Tailored layouts for daily reflection, task planning, dream logs, travel memories, or deep free-writing.
- **Debounced Background Auto-Save**: Silently saves drafts 2–3 seconds after typing pauses with real-time sync indicators.
- **Writing Streaks & Momentum**: Automatically tracks consecutive daily writing streaks.
- **Super Admin & Brand Customization Studio**: Full dashboard for administrators to change the brand logo, app title, slogan, accent palette, manage users, and moderate platform content.

---

## Key Features

- **🎨 Complete Brand Customization Studio**:
  - Upload custom brand logo images (`PNG`, `JPG`, `SVG`, `WebP`, max 4MB).
  - Clean, transparent logo rendering across the **Sidebar**, **Header**, **Login**, and **Register** pages (no forced black background boxes).
  - 1-click curated SVG brand emblem presets (*Mindful Lotus*, *Elegant Quill*, *Golden Dawn*, *Zen Mountain*, *Explorer Compass*, *Cosmic Moon*).
  - Remote image URL support for CDN logos.
  - Live real-time UI preview sandbox with instant multi-surface synchronization.
  - Custom app name, tagline/slogan, theme accent palette, welcome banner, and footer notice.
  - Public registration switch (toggle enabling or closing new user sign-ups).
- **🛡️ Super Administrator Portal**:
  - Aggregated system metrics: Total Users, Admins, Published/Draft Journals, Photo Storage Size, and Journal Styles Popularity.
  - User Accounts Management: Search, filter by role, create new accounts, edit profiles/roles, and delete accounts.
  - Content Moderation: Inspect full entries across all platform users and delete inappropriate posts.
- **✍️ 10 Purpose-Built Journal Templates**: Distinct visual identities tailored to each journaling intent.
- **📝 Rich-Text Writing Canvas**: Formatting toolbar supporting Headings (H1-H3), Bold, Italic, Underline, Highlights, Bullet & Numbered lists, Checklists, Quotes, and Links.
- **💾 Debounced Auto-Save Drafts**: Automatically saves drafts in background with status pills (`Saving...`, `Saved just now ✓`, or `Couldn't save`).
- **🔥 Writing Streaks & Momentum**: Consecutive writing streak tracking based on published entries.
- **📅 Interactive Calendar View**: Monthly calendar with entry count indicators on each day. Click any date to view all journals written on that specific day.
- **🔍 Full-Text & Tag Filtering**: Search across titles, content, and tags with filters by style, mood, date, and sorting.
- **❤️ Favorites & Drafts**: Instant favorite toggle without page reload and dedicated draft recovery.
- **📷 Photo Attachments**: Multi-image uploads stored in Laravel Storage with modal zoom/lightbox viewer.
- **🏷️ Custom Tag System**: Color-coded tags attached to journal entries.
- **☀️ Light & 🌙 Dark Mode**: Tailwind CSS dark mode with persistence in `localStorage`.

---

## Journal Styles & Templates

When users click **"Write Journal"**, the **"Choose Your Journal Style"** selector presents 10 purpose-built layouts:

1. **Classic Journal**: Traditional diary style with paper-like texture, serif typography, distraction-free writing canvas, mood, and tags.
2. **Daily Reflection**: Card-based structured layout asking:
   - *Today's Highlight* ("What was the best part of today?")
   - *Challenges* ("What was difficult today?")
   - *Gratitude* ("What am I grateful for?")
   - *Lessons Learned* ("What did I learn today?")
   - *Tomorrow* ("What do I want to accomplish tomorrow?")
3. **Daily Planner**: Productivity layout with interactive checkable task items, live completion progress bar, today's goals, milestones, notes, and tomorrow's priorities.
4. **Mood Journal**: Visual mood selector featuring 9 feelings (😀 Happy, 🥳 Excited, 😌 Calm, 😐 Neutral, 😔 Sad, 😡 Angry, 😰 Stressed, 😴 Tired, 😟 Anxious), 1–10 intensity slider, and emotional insight prompts.
5. **Gratitude Journal**: Warm minimal palette with dynamic list (add/remove gratitude items), plus prompts for someone appreciated, a positive thought, and something looking forward to.
6. **Free Writing**: Expansive blank canvas designed for uninterrupted flow and stream of consciousness.
7. **Travel Journal**: Photo-forward layout with destination, location, travel companions, weather, culinary discoveries, visited places, notes, and multiple photo uploads.
8. **Study Journal**: Structured research notebook with subject, duration, topics studied, key takeaways, difficult concepts, questions, and lecture notes.
9. **Work Journal**: Professional structured format for main tasks, completed accomplishments, pending items, blockers, solutions, meetings, and wins.
10. **Dream Journal**: Nocturnal starry palette with dream title, narrative memory, people, location, emotions, symbols, and psychological interpretations.

---

## Admin Portal & Brand Studio

The **Admin Portal** (`/admin`) is accessible to users with the `admin` role (`is_admin: true`):

### 1. Dashboard Overview & Quick Brand Setup
- Aggregated KPI cards: Total registered users, published vs draft journals, storage usage, and active writing streaks.
- Visual breakdown of the most popular journal styles and moods across the platform.
- **Quick Brand Control Form**: Change brand logo, select curated presets, or enter image URLs directly from the dashboard overview.

### 2. Brand & Logo Studio
- Upload custom brand logos with instant live preview.
- All logos render transparently without forced dark background boxes.
- Choose from 6 preset brand accent color palettes (*Stone Noir*, *Warm Amber*, *Royal Indigo*, *Emerald Sanctuary*, *Rose Petal*, *Deep Violet*).
- Live simulated multi-view cards showing how the brand logo, app title, and slogans appear on the Sidebar, Header, and Login screens.
- Toggle public registration on or off.

### 3. User Accounts Management
- Search users by name or email, and filter by role (`Super Admin` vs `Journalist`).
- Create new user or administrator accounts directly from modal.
- Edit existing user profiles, change passwords, and promote/demote roles.
- Safe user deletion with protection preventing admins from deleting their own account.

### 4. Journal Content Moderation
- Search platform-wide entries by title, author, or keywords.
- Filter by template style (Classic, Reflection, Planner, Mood, etc.).
- Preview full entry content, metadata, and photos in modal view.
- Delete inappropriate entries with confirmation safeguards.

---

## Technology Stack

### Frontend
- **React.js 19**: Modern component architecture
- **Vite 8**: Ultra-fast build tool and dev server
- **Tailwind CSS v4**: Minimalist, writing-focused styling
- **React Router v7**: Declarative routing with `ProtectedRoute` and `AdminRoute` guards
- **Axios**: Configured client with automatic Bearer token interceptor
- **TanStack Query (React Query v5)**: Server-state caching and queries
- **Zustand**: Lightweight stores for auth, public brand settings, and toasts
- **Lucide React**: Clean icons
- **Canvas Confetti**: Milestone celebrations upon publishing journals

### Backend
- **Laravel 13 REST API**: Robust PHP 8.4 backend
- **Laravel Sanctum**: Secure token-based API authentication
- **EnsureAdmin Middleware**: Route protection for administrative endpoints
- **Form Requests & Validation**: Strict input validation
- **Laravel Policies**: User data ownership and authorization
- **Database Support**: Out-of-the-box SQLite support + MySQL (XAMPP) compatibility

---

## Project Architecture

```
daily-journal/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Admin/
│   │   │   │   │   ├── AdminDashboardController.php
│   │   │   │   │   ├── AdminJournalController.php
│   │   │   │   │   ├── AdminSettingsController.php
│   │   │   │   │   └── AdminUserController.php
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── JournalCalendarController.php
│   │   │   │   ├── JournalEntryController.php
│   │   │   │   ├── JournalImageController.php
│   │   │   │   ├── JournalStatisticsController.php
│   │   │   │   ├── JournalTagController.php
│   │   │   │   └── PublicSettingsController.php
│   │   │   ├── Middleware/
│   │   │   │   └── EnsureAdmin.php
│   │   │   ├── Requests/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── StoreJournalRequest.php
│   │   │   │   ├── UpdateJournalRequest.php
│   │   │   │   ├── UpdateProfileRequest.php
│   │   │   │   └── ChangePasswordRequest.php
│   │   │   └── Resources/
│   │   │       ├── UserResource.php
│   │   │       ├── JournalEntryResource.php
│   │   │       ├── JournalTagResource.php
│   │   │       └── JournalImageResource.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── SystemSetting.php
│   │   │   ├── JournalEntry.php
│   │   │   ├── JournalTag.php
│   │   │   └── JournalImage.php
│   │   └── Policies/
│   │       ├── JournalEntryPolicy.php
│   │       └── JournalTagPolicy.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/DatabaseSeeder.php
│   └── routes/api.php
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── authApi.js
    │   │   ├── adminApi.js
    │   │   ├── settingsApi.js
    │   │   └── journalApi.js
    │   ├── components/
    │   │   ├── common/      (Button, Input, Modal, ConfirmModal, Toast, Skeleton, EmptyState)
    │   │   ├── editor/      (RichEditor, AutoSaveStatus)
    │   │   ├── journal/     (JournalCard, MoodPicker, TagBadge, ImageGallery)
    │   │   └── layout/      (AppLayout, Sidebar, Header, MobileNav)
    │   ├── templates/       (10 Individual Journal Styles)
    │   ├── pages/
    │   │   ├── admin/       (AdminDashboardPage)
    │   │   ├── auth/        (LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage)
    │   │   ├── dashboard/   (DashboardPage)
    │   │   ├── journal/     (AllJournalsPage, JournalEditorPage, JournalDetailPage)
    │   │   ├── calendar/    (CalendarPage)
    │   │   ├── favorites/   (FavoritesPage)
    │   │   ├── drafts/      (DraftsPage)
    │   │   ├── tags/        (TagsPage)
    │   │   ├── statistics/  (StatisticsPage)
    │   │   └── settings/    (SettingsPage)
    │   ├── store/           (authStore, settingsStore, toastStore)
    │   ├── hooks/           (useDebounce, useTheme)
    │   ├── utils/           (dateUtils, moodConstants)
    │   ├── routes/          (ProtectedRoute, AdminRoute)
    │   └── App.jsx
```

---

## Database Architecture

### `users`
- `id` (PK, bigint)
- `name` (string)
- `email` (string, unique)
- `password` (hashed string)
- `role` (varchar 30: `admin`, `user`)
- `is_admin` (boolean, default `false`)
- `avatar` (string, nullable)
- `bio` (text, nullable)
- `settings` (json)
- `timestamps`

### `system_settings`
- `id` (PK, bigint)
- `key` (string, unique) — e.g. `app_name`, `app_tagline`, `app_logo`, `app_logo_bg`, `primary_color`, `welcome_message`, `footer_text`, `allow_registration`
- `value` (text, nullable)
- `group` (varchar 50, default `general`)
- `timestamps`

### `journal_entries`
- `id` (PK, bigint)
- `user_id` (FK → users.id, cascade)
- `title` (string)
- `type` (varchar 50: `classic`, `reflection`, `planner`, `mood`, `gratitude`, `free_writing`, `travel`, `study`, `work`, `dream`)
- `content` (longText, nullable)
- `data` (json: stores structured fields for each template)
- `mood` (varchar 50, nullable)
- `mood_score` (tinyint unsigned 1–10, nullable)
- `journal_date` (date)
- `is_favorite` (boolean)
- `is_draft` (boolean)
- `timestamps`

### `journal_tags`
- `id` (PK, bigint)
- `user_id` (FK → users.id, cascade)
- `name` (varchar 100)
- `color` (varchar 30)
- `timestamps`

### `journal_entry_tag`
- `journal_entry_id` (FK → journal_entries.id, cascade)
- `tag_id` (FK → journal_tags.id, cascade)
- Primary Key: `(journal_entry_id, tag_id)`

### `journal_images`
- `id` (PK, bigint)
- `journal_entry_id` (FK → journal_entries.id, cascade)
- `image_path` (string)
- `original_name` (string, nullable)
- `file_size` (unsigned int, nullable)
- `mime_type` (varchar 50, nullable)
- `caption` (string, nullable)
- `timestamps`

---

## REST API Architecture

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/settings/public` | Get public brand logo, app title, and system settings | No |
| `POST` | `/api/register` | Register a new user (respects registration toggle) | No |
| `POST` | `/api/login` | Login and receive Sanctum bearer token | No |
| `POST` | `/api/forgot-password` | Generate reset token | No |
| `POST` | `/api/reset-password` | Reset password using token | No |

### Authenticated User Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/logout` | Revoke current bearer token | Yes |
| `GET` | `/api/user` | Get profile of authenticated user | Yes |
| `PUT` | `/api/user/profile` | Update profile information | Yes |
| `PUT` | `/api/user/password` | Change password | Yes |
| `GET` | `/api/journals` | List user journals with search, filter, pagination | Yes |
| `POST` | `/api/journals` | Create a new journal entry | Yes |
| `GET` | `/api/journals/{id}` | Read entry details (ownership verified) | Yes |
| `PUT` | `/api/journals/{id}` | Update entry (ownership verified) | Yes |
| `DELETE` | `/api/journals/{id}` | Delete entry (ownership verified) | Yes |
| `POST` | `/api/journals/{id}/favorite` | Toggle favorite flag | Yes |
| `POST` | `/api/journals/autosave` | Debounced auto-save draft | Yes |
| `GET` | `/api/favorites` | Filter user favorite entries | Yes |
| `GET` | `/api/drafts` | Filter user draft entries | Yes |
| `POST` | `/api/journals/{id}/images` | Upload image for journal | Yes |
| `DELETE` | `/api/journals/images/{id}` | Delete attached image | Yes |
| `GET` | `/api/tags` | List user tags | Yes |
| `POST` | `/api/tags` | Create a new user tag | Yes |
| `DELETE` | `/api/tags/{id}` | Delete user tag | Yes |
| `GET` | `/api/calendar` | Monthly view dates and day entries | Yes |
| `GET` | `/api/statistics` | Streaks, counts, and distributions | Yes |

### Super Administrator Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Aggregated system metrics & distributions | Admin |
| `GET` | `/api/admin/users` | List all users with search, role filters, and pagination | Admin |
| `POST` | `/api/admin/users` | Create user or administrator account | Admin |
| `PUT` | `/api/admin/users/{id}` | Update user details, role, or password | Admin |
| `DELETE` | `/api/admin/users/{id}` | Delete user and all associated entries | Admin |
| `GET` | `/api/admin/journals` | Search and list all platform journals for moderation | Admin |
| `GET` | `/api/admin/journals/{id}` | View full details of any journal entry | Admin |
| `DELETE` | `/api/admin/journals/{id}` | Moderate and delete inappropriate journal entry | Admin |
| `GET` | `/api/admin/settings` | Get all system and brand settings | Admin |
| `PUT` | `/api/admin/settings` | Update brand settings (title, slogan, colors, etc.) | Admin |
| `POST` | `/api/admin/settings/logo` | Upload custom brand logo image | Admin |
| `DELETE` | `/api/admin/settings/logo` | Remove brand logo / reset to default emblem | Admin |

---

## Installation & Quick Start

### Prerequisites
- **PHP** >= 8.3 (with `pdo_sqlite` or `pdo_mysql`, `mbstring`, `openssl`)
- **Composer** >= 2.0
- **Node.js** >= 18 and **npm**

### Backend Setup (Laravel)

```bash
cd backend

# Copy environment configuration (pre-configured for SQLite by default)
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations and seed admin & demo accounts
php artisan migrate --seed

# Create storage symlink for uploaded logos and photos
php artisan storage:link

# Start the Laravel REST API server (runs on http://127.0.0.1:8000)
php artisan serve --port=8000
```

### Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## Demo & Admin Credentials

The database seeder automatically initializes two ready-to-use accounts:

### 🛡️ Super Administrator Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin` (`is_admin: true`)
- **Permissions**: Full control over brand logo customizer, system settings, user management, and content moderation.

### ✍️ Demo Journalist Account
- **Email**: `demo@example.com`
- **Password**: `password123`
- **Role**: `user`
- **Content**: 23 realistic pre-seeded journal entries across all 10 templates, tags, photos, moods, and active writing streaks.

*(On the login page at [http://localhost:5173/login](http://localhost:5173/login), click the **"Admin"** or **"Journalist"** button to auto-fill credentials instantly).*

---

## Running Feature Tests

The backend includes a comprehensive PHPUnit test suite covering authentication, admin policies, brand customization, journal CRUD, drafts autosaving, favorite toggling, and streak calculations:

```bash
cd backend
php artisan test
```

Expected result:
```
PASS  Tests\Feature\AdminApiTest
✓ admin can login with valid credentials
✓ regular user cannot access admin stats
✓ admin can access admin stats
✓ admin can update brand settings
✓ admin can upload and delete brand logo

PASS  Tests\Feature\JournalApiTest
✓ user can register
✓ user can login with valid credentials
✓ unauthenticated user cannot access journals
✓ user cannot access another users journal
✓ user can create and fetch journal
✓ user can toggle favorite
✓ user can autosave draft
✓ statistics and streak endpoint

Tests:    15 passed (66 assertions)
```

---

## Security & Authorization

- **Sanctum Authentication**: Only authenticated requests bearing a valid token in the `Authorization: Bearer <token>` header can access protected resources.
- **Admin Guard Middleware**: Routes under `/api/admin/*` strictly enforce `EnsureAdmin` middleware verification.
- **Ownership Verification**: Policies (`JournalEntryPolicy` and `JournalTagPolicy`) ensure users cannot access, edit, or delete another user's journals or tags.
- **Server-Side User Identification**: The authenticated user ID is strictly determined server-side from `auth()->id()`.
- **File Validation**: Image and logo uploads are validated for valid mime types (`jpeg, png, jpg, webp, svg, gif`) and maximum file size (4–5MB).
