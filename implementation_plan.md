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

---

## Work Division — 8-Hour Timeline

### Phase 1 — Foundation (Hour 0–2)
- Auth system, JWT, Database schema, WebSocket config, Project scaffolding.

### Phase 2 — Core Features (Hour 2–5)
- Trip CRUD, City Search, Itinerary Builder, Budget Tracking.

### Phase 3 — Advanced Features (Hour 5–7)
- AI Itinerary Generation (Gemini), Community Sharing, Real-time Collab, Admin Analytics.

### Phase 4 — Polish & Deploy (Hour 7–8)
- End-to-end testing, responsive design, and deployment.
