# Daily Journal — Digital Diary & Mindful Writing Web Application

A modern, distraction-free **Daily Journal / Digital Diary** application built with **React.js, Vite, Tailwind CSS, Laravel 13, and MySQL (XAMPP)**. Designed to blend the warmth of a personal diary, the structure of Notion, and the flow of a modern writing sanctuary.

---

## 📖 Table of Contents

- [Overview & Philosophy](#overview--philosophy)
- [Key Features](#key-features)
- [Journal Styles & Templates](#journal-styles--templates)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Database Architecture](#database-architecture)
- [REST API Architecture](#rest-api-architecture)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [XAMPP & MySQL Configuration](#xampp--mysql-configuration)
  - [Backend Setup (Laravel)](#backend-setup-laravel)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Demo Credentials](#demo-credentials)
- [Running Feature Tests](#running-feature-tests)
- [Security & Authorization](#security--authorization)

---

## Overview & Philosophy

Daily Journal is created specifically for calm, intentional daily journaling. Unlike rigid administrative dashboards or bloated note applications:
- The **journal is always the primary focus**.
- Users select **purpose-built page designs** suited to their mental state or goals (e.g. reflections, task planning, dream logs, travel memories, or deep free-writing).
- Features **debounced background auto-save** so thoughts are never lost without interrupting flow.
- Features **consecutive writing streak tracking** and thoughtful empty states.

---

## Key Features

- **10 Purpose-Built Journal Templates**: Distinct visual identities tailored to each journaling intent.
- **Rich-Text Writing Canvas**: Formatting toolbar supporting Headings (H1-H3), Bold, Italic, Underline, Highlights, Bullet & Numbered lists, Checklists, Quotes, and Links.
- **Debounced Auto-Save Drafts**: Automatically saves drafts 2–3 seconds after typing pauses with real-time indicators (`Saving...`, `Saved just now ✓`, or `Couldn't save` with retry).
- **Writing Streaks & Momentum**: Automatically calculates current consecutive writing streak and all-time longest streak (only counting completed, published entries).
- **Personalized Greeting**: Dynamic time-of-day greeting (`Good Morning`, `Good Afternoon`, `Good Evening`) with current date and prominent `+ Write Today's Journal` CTA.
- **Calendar View**: Interactive monthly calendar with entry count indicators on each day. Click any date to view all journals written on that specific day.
- **Full-Text & Tag Filtering**: Backend-powered search across titles, content, and tags, with filters by journal style, mood, tag, date, and sorting.
- **Favorites & Drafts Management**: Smooth inline favorite toggling without full-page reloads and dedicated draft recovery.
- **Photo Attachments**: Multi-image uploads stored securely in Laravel Storage with modal zoom/lightbox viewer.
- **Custom Tag System**: Create color-coded tags and attach multiple tags to entries.
- **Minimalist Charts & Insights**: Clean SVG visualizers for writing activity, mood distribution, and template popularity without dashboard clutter.
- **☀️ Light & 🌙 Dark Mode**: Tailwind CSS dark mode with persistence in `localStorage`.
- **Custom Confirmation Modals**: Confirmation dialogs for non-destructive accidental clicks (no browser `confirm()`).

---

## Journal Styles & Templates

When users click **"Write Journal"**, the **"Choose Your Journal Style"** selector presents 10 cards:

1. **Classic Journal**: Traditional diary style with paper-like ruled texture, serif typography, distraction-free writing canvas, mood, and tags.
2. **Daily Reflection**: Card-based structured layout asking:
   - *Today's Highlight* ("What was the best part of today?")
   - *Challenges* ("What was difficult today?")
   - *Gratitude* ("What am I grateful for?")
   - *Lessons Learned* ("What did I learn today?")
   - *Tomorrow* ("What do I want to accomplish tomorrow?")
3. **Daily Planner**: Productivity layout with interactive checkable task items, live completion progress bar, today's goals, important milestones, notes, and tomorrow's priorities.
4. **Mood Journal**: Visual mood selector featuring 9 feelings (😀 Happy, 🥳 Excited, 😌 Calm, 😐 Neutral, 😔 Sad, 😡 Angry, 😰 Stressed, 😴 Tired, 😟 Anxious), 1–10 intensity slider, and emotional insight prompts.
5. **Gratitude Journal**: Warm minimal palette with dynamic list (add/remove gratitude items), plus prompts for someone appreciated, a positive thought, and something looking forward to.
6. **Free Writing**: Expansive blank canvas designed for uninterrupted flow and stream of consciousness.
7. **Travel Journal**: Photo-forward layout with destination, location, travel companions, weather, culinary discoveries, visited places, notes, and multiple photo uploads.
8. **Study Journal**: Structured research notebook with subject, duration, topics studied, key takeaways, difficult concepts, questions, and lecture notes.
9. **Work Journal**: Professional structured format for main tasks, completed accomplishments, pending items, blockers, solutions, meetings, and wins.
10. **Dream Journal**: Nocturnal starry palette with dream title, narrative memory, people, location, emotions, symbols, and psychological interpretations.

---

## Technology Stack

### Frontend
- **React.js 19**: Modern component architecture
- **Vite 8**: Ultra-fast build tool and dev server
- **Tailwind CSS v4**: Minimalist, writing-focused styling
- **React Router v7**: Declarative routing with `ProtectedRoute`
- **Axios**: Configured client with automatic Bearer token interceptor
- **TanStack Query (React Query v5)**: Server-state caching and queries
- **Zustand**: Lightweight auth and toast notification stores
- **Lucide React**: Clean icons
- **Canvas Confetti**: Milestone celebrations upon publishing journals

### Backend
- **Laravel 13 REST API**: Robust PHP 8.4 backend
- **Laravel Sanctum**: Secure token-based API authentication
- **Form Requests**: Validations (`RegisterRequest`, `StoreJournalRequest`, etc.)
- **Laravel Policies**: User data ownership and authorization
- **API Resources**: Standardized JSON responses:
  ```json
  {
    "success": true,
    "message": "...",
    "data": {}
  }
  ```

### Database
- **MySQL 8.4** via **XAMPP** on `localhost:3306`
- Database Name: `daily_journal`

---

## Project Architecture

```
daily-journal/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── JournalEntryController.php
│   │   │   │   ├── JournalCalendarController.php
│   │   │   │   ├── JournalImageController.php
│   │   │   │   ├── JournalStatisticsController.php
│   │   │   │   └── JournalTagController.php
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
    │   │   └── journalApi.js
    │   ├── components/
    │   │   ├── common/      (Button, Input, Modal, ConfirmModal, Toast, Skeleton, EmptyState)
    │   │   ├── editor/      (RichEditor, AutoSaveStatus)
    │   │   ├── journal/     (JournalCard, MoodPicker, TagBadge, ImageGallery)
    │   │   └── layout/      (AppLayout, Sidebar, Header, MobileNav)
    │   ├── templates/       (10 Individual Journal Styles)
    │   ├── pages/           (Dashboard, AllJournals, Calendar, Favorites, Drafts, Tags, Stats, Settings, Auth)
    │   ├── store/           (authStore, toastStore)
    │   ├── hooks/           (useDebounce, useTheme)
    │   ├── utils/           (dateUtils, moodConstants)
    │   ├── routes/          (ProtectedRoute)
    │   └── App.jsx
```

---

## Database Architecture

### `users`
- `id` (PK, bigint)
- `name` (string)
- `email` (string, unique)
- `password` (hashed string)
- `avatar` (string, nullable)
- `bio` (text, nullable)
- `settings` (json)
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

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/register` | Register a new user | No |
| `POST` | `/api/login` | Login and receive Sanctum bearer token | No |
| `POST` | `/api/forgot-password` | Generate reset token | No |
| `POST` | `/api/reset-password` | Reset password using token | No |
| `POST` | `/api/logout` | Revoke current token | Yes |
| `GET` | `/api/user` | Get profile of authenticated user | Yes |
| `PUT` | `/api/user/profile` | Update profile information | Yes |
| `PUT` | `/api/user/password` | Change password | Yes |
| `GET` | `/api/journals` | List journals with search, filter, pagination | Yes |
| `POST` | `/api/journals` | Create a new journal entry | Yes |
| `GET` | `/api/journals/{id}` | Read entry details (ownership checked) | Yes |
| `PUT` | `/api/journals/{id}` | Update entry (ownership checked) | Yes |
| `DELETE` | `/api/journals/{id}` | Delete entry (ownership checked) | Yes |
| `POST` | `/api/journals/{id}/favorite` | Toggle favorite flag | Yes |
| `POST` | `/api/journals/autosave` | Debounced auto-save draft | Yes |
| `GET` | `/api/favorites` | Filter user favorite entries | Yes |
| `GET` | `/api/drafts` | Filter user draft entries | Yes |
| `POST` | `/api/journals/{id}/images` | Upload image for journal | Yes |
| `DELETE` | `/api/journals/images/{id}` | Delete attached image | Yes |
| `GET` | `/api/tags` | List all user tags | Yes |
| `POST` | `/api/tags` | Create a new user tag | Yes |
| `DELETE` | `/api/tags/{id}` | Delete user tag | Yes |
| `GET` | `/api/calendar` | Monthly view dates and day entries | Yes |
| `GET` | `/api/statistics` | Streaks, counts, and distributions | Yes |

---

## Installation & Setup

### Prerequisites
- **PHP** >= 8.3 (with `pdo_mysql`, `mbstring`, `fileinfo`, `openssl`)
- **Composer** >= 2.0
- **Node.js** >= 18 and **npm**
- **XAMPP** (or MySQL Server) running on port `3306`

### XAMPP & MySQL Configuration
1. Start the **Apache** and **MySQL** services in the XAMPP Control Panel.
2. Ensure MySQL is running on `127.0.0.1:3306`.
3. Create the database:
   ```sql
   CREATE DATABASE daily_journal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Backend Setup (Laravel)

```bash
cd backend

# Copy environment configuration
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed realistic demo journals
php artisan migrate --seed

# Create storage symlink for uploaded photos
php artisan storage:link

# Start the Laravel REST API server (runs on http://localhost:8000)
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

## Demo Credentials

The database seeder automatically initializes a rich demo account with 23 realistic journal entries across all 10 templates, tags, photos, moods, and active writing streaks:

- **Email**: `demo@example.com`
- **Password**: `password123`

*(On the login screen, you can also click the **"Auto Fill"** button to instantly populate these credentials).*

---

## Running Feature Tests

The backend includes a comprehensive PHPUnit/Pest feature test suite verifying authentication, policy authorization, journal CRUD, drafts autosaving, favorite toggling, and streak calculations:

```bash
cd backend
php artisan test --filter=JournalApiTest
```

---

## Security & Authorization

- **Sanctum Authentication**: Only authenticated requests bearing a valid token in the `Authorization: Bearer <token>` header can access journal resources.
- **Ownership Verification**: Policies (`JournalEntryPolicy` and `JournalTagPolicy`) ensure a user can NEVER access, update, or delete another user's journal or tags.
- **Never Trust Frontend User ID**: The authenticated user ID is strictly determined server-side from `auth()->id()`.
- **File Validation**: Image uploads are validated for valid mime types (`jpeg, png, jpg, webp, gif`) and maximum file size (5MB).

