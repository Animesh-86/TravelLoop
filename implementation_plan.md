# TravelLoop — Hackathon Implementation Plan (v2)

> **Hackathon**: Voodoo (Odoo) Hackathon | **Duration**: 8 Hours | **Team**: Animesh + Kajol
> **Repo**: https://github.com/Animesh-86/TravelLoop.git (monorepo)

---

## Context & Goals

Build **TravelLoop** — a personalized multi-city travel planning platform with **all 14 screens**, AI-powered planning, real-time collaboration, and admin analytics. The hackathon judges evaluate: coding standards, logic, modularity, frontend design, performance, scalability, security, usability, database design, and attention to detail.

> [!IMPORTANT]
> **Hackathon rules to respect:**
> - No BaaS (Firebase/Supabase) — use local PostgreSQL
> - Build from scratch, minimal third-party API usage
> - Real dynamic data, not static JSON
> - Both team members must show genuine Git contributions
> - Code must look human-written, not AI-generated
> - **All 14 screens** from the wireframes must be implemented

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite | 10x faster HMR vs CRA |
| **Styling** | TailwindCSS + shadcn/ui | Rapid, consistent design system; accessible components |
| **State** | Zustand + React Query | Lightweight global state + smart server-state caching |
| **Charts** | Recharts | Budget visualization & admin analytics |
| **Animations** | Framer Motion | Subtle micro-interactions |
| **Real-time** | SockJS + STOMP.js (client) | WebSocket collaborative editing |
| **Backend** | Spring Boot 3.2 (Java 17+) | Production-grade, SOLID architecture |
| **AI** | **Spring AI 1.1.x** + Anthropic Claude | Framework-native AI — cleaner than raw REST calls |
| **WebSockets** | Spring WebSocket + STOMP | Real-time collaborative trip editing |
| **Email** | Spring Mail + SMTP | Trip sharing notifications, welcome emails |
| **Database** | PostgreSQL 15 | JSONB support, proper relational design |
| **Auth** | Spring Security + JWT | Secure, stateless authentication |
| **ORM** | Spring Data JPA + Hibernate | Repository pattern |
| **API Docs** | Swagger/OpenAPI | Self-documenting endpoints |

### Why Spring AI over raw RestTemplate?

| Aspect | Spring AI | Raw RestTemplate |
|--------|-----------|-----------------|
| **Setup** | `spring-ai-anthropic-spring-boot-starter` — one dependency | Manual JSON construction, headers, error handling |
| **Code quality** | `ChatClient` abstraction — clean, testable | Messy HTTP boilerplate |
| **Provider portability** | Swap Claude → OpenAI with config change | Hardcoded to one provider |
| **Hackathon impression** | Shows you know modern Spring ecosystem | Looks like copy-paste code |
| **Prompt templating** | Built-in `PromptTemplate` with variables | Manual string concatenation |

> [!TIP]
> Spring AI is the right call here. It makes the AI integration look like a natural part of your Spring architecture (not a bolted-on hack), and judges will see proper DI, clean service layers, and framework-native patterns.

**Spring AI integration will look like:**
```java
@Service
public class SmartPlannerService {
    private final ChatClient chatClient;

    public SmartPlannerService(ChatClient.Builder builder) {
        this.chatClient = builder
            .defaultSystem("You are a travel planning assistant...")
            .build();
    }

    public ItinerarySuggestion generateItinerary(TripContext context) {
        return chatClient.prompt()
            .user(buildPrompt(context))
            .call()
            .entity(ItinerarySuggestion.class);  // Auto-parsed!
    }
}
```

---

## Design Philosophy

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#2D5F5D` | Deep Teal — trust, journey |
| `--secondary` | `#E8956F` | Terracotta — warmth, adventure |
| `--accent` | `#F4A261` | Sunset Orange — energy |
| `--neutral-dark` | `#2C3639` | Charcoal text |
| `--neutral-light` | `#F5F1E8` | Warm White backgrounds |
| `--success` | `#52796F` | Sage Green confirmations |

**Principles**: Cards with subtle shadows, generous Airbnb-style whitespace, 8px/16px rounded corners, micro-interactions, Inter or Manrope font.

---

## Database Schema (10 tables)

```
users ──< trips ──< trip_stops ──< trip_activities >── activities
                  │                                       │
                  ├──< budgets                      cities ─┘
                  ├──< packing_items
                  ├──< trip_notes
                  └──< trip_collaborators (NEW — for WebSocket collab)
```

Added table for collaborative editing:
```sql
CREATE TABLE trip_collaborators (
    id               UUID PRIMARY KEY,
    trip_id          UUID REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id          UUID REFERENCES users(user_id) ON DELETE CASCADE,
    role             VARCHAR(20) DEFAULT 'viewer',  -- viewer, editor
    invited_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, user_id)
);
```

---

## All 14 Screens — Complete Scope

| # | Screen | Owner | Phase |
|---|--------|-------|-------|
| 1 | **Login** | Kajol | Phase 1 |
| 2 | **Registration / Signup** | Kajol | Phase 1 |
| 3 | **Dashboard / Home** | Kajol | Phase 2 |
| 4 | **Create Trip** | Kajol | Phase 2 |
| 5 | **Build Itinerary** | Kajol | Phase 2 |
| 6 | **User Trip Listing** (My Trips) | Kajol | Phase 2 |
| 7 | **User Profile Page** | Kajol | Phase 3 |
| 8 | **Activity / City Search** | Kajol | Phase 2 |
| 9 | **Itinerary View with Budget** | Kajol | Phase 3 |
| 10 | **Community Tab** (Public shared trips) | Kajol | Phase 3 |
| 11 | **Packing Checklist** | Kajol | Phase 3 |
| 12 | **Admin Panel** | Kajol | Phase 3 |
| 13 | **Trip Notes / Journal** | Kajol | Phase 3 |
| 14 | **Expense Invoice / Billing** | Kajol | Phase 3 |

---

## Monorepo Structure

```
TravelLoop/                          ← existing GitHub repo
├── backend/                         ← Spring Boot 3.2
│   ├── src/main/java/com/traveloop/
│   │   ├── config/                  SecurityConfig, CorsConfig, WebSocketConfig, OpenAPIConfig
│   │   ├── model/
│   │   │   ├── entity/              User, Trip, City, TripStop, Activity, Budget...
│   │   │   └── dto/
│   │   │       ├── request/         CreateTripRequest, AddStopRequest...
│   │   │       └── response/        TripResponse, ItineraryResponse...
│   │   ├── repository/              UserRepository, TripRepository...
│   │   ├── service/
│   │   │   ├── interfaces/          TripService, AIRecommendationService...
│   │   │   └── impl/               TripServiceImpl, SmartPlannerService...
│   │   ├── controller/             AuthController, TripController, AIController, AdminController
│   │   ├── websocket/              TripCollaborationHandler, WebSocketEventListener
│   │   ├── exception/              GlobalExceptionHandler, ResourceNotFoundException...
│   │   └── util/                   JwtUtil, ValidationUtil, EmailService
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── schema.sql
│   │   └── data.sql                 ← seed data (50+ cities, 200+ activities)
│   └── pom.xml
│
├── frontend/                        ← React 18 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  Button, Card, Input, Modal (shadcn/ui)
│   │   │   ├── layout/             Navbar, Sidebar, Footer, ProtectedRoute
│   │   │   ├── trip/               TripCard, TripForm, StopCard
│   │   │   ├── itinerary/          TimelineView, DayBlock, ActivityItem
│   │   │   ├── budget/             BudgetChart, CostBreakdown, InvoiceView
│   │   │   ├── community/          CommunityFeed, SharedTripCard
│   │   │   └── admin/              AnalyticsDashboard, UserTable, ChartWidgets
│   │   ├── pages/
│   │   │   ├── Login.jsx            (Screen 1)
│   │   │   ├── Signup.jsx           (Screen 2)
│   │   │   ├── Dashboard.jsx        (Screen 3)
│   │   │   ├── CreateTrip.jsx       (Screen 4)
│   │   │   ├── ItineraryBuilder.jsx  (Screen 5)
│   │   │   ├── MyTrips.jsx          (Screen 6)
│   │   │   ├── Profile.jsx          (Screen 7)
│   │   │   ├── Search.jsx           (Screen 8)
│   │   │   ├── ItineraryView.jsx    (Screen 9)
│   │   │   ├── Community.jsx        (Screen 10)
│   │   │   ├── PackingChecklist.jsx  (Screen 11)
│   │   │   ├── AdminPanel.jsx       (Screen 12)
│   │   │   ├── TripNotes.jsx        (Screen 13)
│   │   │   └── ExpenseInvoice.jsx   (Screen 14)
│   │   ├── hooks/                   useAuth, useTrips, useBudget, useWebSocket
│   │   ├── services/                api.js, authService.js, tripService.js, wsService.js
│   │   ├── store/                   authStore.js, tripStore.js (Zustand)
│   │   └── utils/                   validators.js, formatters.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Work Division — 8-Hour Timeline

### Phase 1 — Foundation (Hour 0–2)

#### Together (Hour 0–0:30) — Pair Programming
- Finalize DB schema on whiteboard (15 min)
- Define ALL API endpoints in a shared doc (15 min)

#### Hour 0:30–2:00

| Animesh (Backend) | Kajol (Frontend) |
|---|---|
| Spring Boot project scaffold with `pom.xml` | React + Vite project scaffold |
| Add dependencies: Spring AI, Spring WebSocket, Spring Mail, Spring Security, JPA, PostgreSQL | `tailwind.config.js` — design tokens (colors, spacing, fonts) |
| `SecurityConfig.java` — JWT filter chain | shadcn/ui init + component library setup |
| `WebSocketConfig.java` — STOMP over SockJS | Shared layout: `Navbar`, `Sidebar`, `Footer` |
| `User` entity + `UserRepository` | **Screen 1**: Login page (email/password, validation) |
| Auth endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` | **Screen 2**: Signup page (name, email, phone, city, country) |
| `JwtUtil`, password hashing (BCrypt) | Axios instance with JWT interceptor + `ProtectedRoute` |
| `schema.sql` + `data.sql` (seed cities & activities) | `authStore.js` (Zustand) — login state management |
| `EmailService` — welcome email on registration | Global CSS: typography, spacing, card styles |

**Git branches**: `feature/auth-system` (Animesh), `feature/project-setup-ui` (Kajol)

---

### Phase 2 — Core Features (Hour 2–5)

| Animesh (Backend) | Kajol (Frontend) |
|---|---|
| **Hour 2–3** | **Hour 2–3** |
| Trip CRUD: `TripController` — `GET/POST/PUT/DELETE /api/trips` | **Screen 3**: Dashboard — banner, welcome, recent trips, top cities |
| `TripService` + validation (`@Valid`, custom validators) | **Screen 4**: Create Trip form (name, dates, place, description) |
| `CreateTripRequest` DTO with `@NotBlank`, `@Future` etc. | `TripCard` component — reusable across pages |
| **Hour 3–4** | **Hour 3–4** |
| `TripStop` CRUD — `POST/PUT/DELETE /api/trips/{id}/stops` | **Screen 5**: Itinerary Builder — add sections, assign dates & budget |
| `Activity` search — `GET /api/activities?city=&category=&sort=` | **Screen 6**: My Trips — tabs (Ongoing/Upcoming/Completed), trip cards |
| `TripActivity` scheduling — `POST /api/stops/{id}/activities` | React Query hooks: `useTrips`, `useActivities` |
| **Hour 4–5** | **Hour 4–5** |
| Budget calculation: `BudgetService` — auto-sum from trip activities | **Screen 8**: City/Activity Search — search bar, filters, sort, results list |
| `GET /api/trips/{id}/budget` with category breakdowns | Budget components: `BudgetChart` (pie), `CostBreakdown` (bar) |
| City & Activity seed data finalization (50+ cities, 200+ activities) | Connect all pages to backend APIs, loading skeletons |

---

### Phase 3 — Advanced Features (Hour 5–7)

| Animesh (Backend) | Kajol (Frontend) |
|---|---|
| **Hour 5–5:45** | **Hour 5–5:45** |
| **Spring AI integration**: `SmartPlannerService` using `ChatClient` | **Screen 9**: Itinerary View with Budget — day-wise layout, timeline |
| `POST /api/ai/generate-itinerary` — accepts natural language, returns structured plan | AI input UI: text field "Plan 3 days in Paris under $1500" |
| Prompt template with `PromptTemplate` for structured output | Display AI results with accept/modify/regenerate buttons |
| **Hour 5:45–6:30** | **Hour 5:45–6:30** |
| Public sharing: `GET /api/public/trips/{shareToken}` (no auth) | **Screen 10**: Community Tab — public feed of shared trips, filters |
| WebSocket handler: `TripCollaborationHandler` — broadcast trip edits to connected users | **Screen 7**: User Profile — editable fields, preplanned trips, previous trips |
| `trip_collaborators` CRUD — invite users to edit | WebSocket client: `useWebSocket` hook — live activity indicators |
| **Hour 6:30–7:00** | **Hour 6:30–7:00** |
| Packing checklist: `PackingItemController` — CRUD + category endpoints | **Screen 11**: Packing Checklist — categories, checkboxes, progress bar |
| Trip notes: `TripNoteController` — CRUD per trip/stop | **Screen 13**: Trip Notes/Journal — add/edit/delete notes, timestamps |
| Admin analytics: `AdminController` — `GET /api/admin/stats` (trips created, top cities, user engagement) | **Screen 12**: Admin Panel — charts (Recharts), user table, stats cards |
| Email: trip sharing notification | **Screen 14**: Expense Invoice — trip cost summary, category table, export button |

---

### Phase 4 — Polish & Deploy (Hour 7–8)

#### Together (Hour 7:00–7:30) — Integration & Testing
- End-to-end flow: Register → Login → Create Trip → AI Generate → Build Itinerary → View Budget → Share → View Community
- Test WebSocket: open 2 browser tabs, edit trip in one, see updates in other
- Fix integration bugs, CORS issues
- Responsive polish — mobile breakpoints for all 14 screens

#### Together (Hour 7:30–8:00) — Deploy & Present
- **Frontend** → Vercel (connect GitHub, `VITE_API_URL` env var)
- **Backend** → Railway or Render (PostgreSQL add-on, JWT secret, Claude API key, SMTP config)
- Seed production DB with demo data
- Pre-create demo account with a sample completed trip
- Prepare 5-slide presentation deck

---

## Git Strategy

```
main
└── dev
    ├── feature/auth-system              (Animesh)
    ├── feature/trip-management          (Animesh)
    ├── feature/budget-service           (Animesh)
    ├── feature/ai-recommendations       (Animesh)
    ├── feature/websocket-collab         (Animesh)
    ├── feature/admin-backend            (Animesh)
    ├── feature/project-setup-ui         (Kajol)
    ├── feature/dashboard-ui             (Kajol)
    ├── feature/itinerary-builder        (Kajol)
    ├── feature/itinerary-view           (Kajol)
    ├── feature/community-ui             (Kajol)
    ├── feature/admin-panel              (Kajol)
    └── feature/polish-responsive        (Both)
```

**Commit rules:**
- Meaningful messages: `feat(auth): implement JWT with refresh token rotation`
- Commit every 20-30 min
- Cross-review PRs: Kajol reviews Animesh's PRs, vice versa
- Co-authored commits for integration: `Co-authored-by: Kajol <kajol@email.com>`

---

## Verification Plan

### During Development
- Backend: Test each API with Swagger UI as built
- Frontend: Visual check in browser after each component
- Integration: Test auth flow end-to-end after Phase 1
- WebSocket: Test with 2 browser tabs after Phase 3

### Pre-Submission
- Full flow: Register → Login → Create Trip → AI Generate → Build Itinerary → Budget → Share → Community
- Mobile responsive check on all 14 screens
- Error handling: invalid inputs, network failures, auth expiry
- Git log: verify both team members have regular, meaningful commits
- Performance: React Query caching, loading states, no unnecessary re-renders
