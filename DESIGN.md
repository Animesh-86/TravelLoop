# TravelLoop Design Specification & Figma Prompt Guide

This document outlines the visual identity, UI components, and detailed screen specifications for **TravelLoop**, a collaborative travel planning platform. 

---

## 🎨 Design System: "Horizon Luxe"

**Core Concept:** A blend of **Glassmorphism** and **Modern Minimalism**. The interface should feel "airy," premium, and highly functional. It should evoke the feeling of looking through a window at a beautiful destination.

### 1. Color Palette
- **Primary (Deep Space):** `#0F172A` (Backgrounds, Sidebars)
- **Secondary (Horizon Indigo):** `#6366F1` (Primary Actions, Links)
- **Accent (Teal Glaze):** `#2DD4BF` (Success, Progress, Active States)
- **Surface (Glass):** `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(12px)`
- **Typography:**
  - **Heading:** `#F8FAFC` (White/Slate 50)
  - **Body:** `#94A3B8` (Slate 400)

### 2. Typography
- **Primary Font:** `Inter` or `Outfit` (Geometric, clean, modern)
- **Weight Strategy:** 
  - SemiBold (600) for Headings.
  - Regular (400) for Body.
  - Medium (500) for Labels/Buttons.

### 3. Visual Styles
- **Border Radius:** `16px` for cards, `12px` for buttons (Soft, modern).
- **Shadows:** Subtle "Soft Glow" shadows instead of heavy black shadows.
- **Micro-Animations:** Smooth transitions (200ms ease-in-out) for hover states.

---

## 🖥️ Screen Specifications

### 1. Landing Page (The Inspiration)
- **Hero Section:** Full-width high-res cinematic background of a scenic destination. Large centered headline: *"Plan Together. Travel Forever."* 
- **Search Bar:** Centered "Glass" floating bar with "Where to next?" input and "Date Range."
- **Feature Cards:** Three glowing glass cards: "Smart AI Itineraries," "Real-time Collaboration," "Budget Analytics."
- **Popular Destinations:** A grid of cards with hover-zoom effects and cost-index badges (e.g., $$, $$$).

### 2. Authentication (Login/Register)
- **Layout:** Split screen or centered modal. 
- **Design:** Minimalist. Indigo gradient border. Social login icons (Google, GitHub) with clean outlines. 
- **Validation:** Soft teal glow on successful input.

### 3. User Dashboard (The Command Center)
- **Sidebar:** Slim, frosted glass sidebar with icons for "My Trips," "Shared with Me," "Explore," "Settings."
- **Active Trip Header:** Large banner showing the next upcoming trip with a countdown timer.
- **Trip Grid:** Cards showing Trip Name, Dates, and "Collaborator Avatars" (overlapping circles).
- **Quick Action:** Large "+" button with "Create New Trip" in a gradient.

### 4. Trip Planner (The Collaborative Canvas)
*This is the core "Working Area" of the application.*
- **Top Bar:** Trip Title, Status (Upcoming/Active), and "Share" button.
- **Split View:** 
  - **Left Panel (Itinerary):** A vertical timeline with Day-by-Day view. Drag-and-drop handles for activities.
  - **Right Panel (Tabs):**
    - **Map:** Integrated Google/Mapbox view showing pins of stops.
    - **Budget:** Recharts Pie Chart (Category breakdown) and Bar Chart (Estimated vs Actual).
    - **Packing:** Checklist with strikethrough animation.
- **Floating Chat:** A small collapsed bubble on the bottom right for real-time collaborator chat.

### 5. Explorer (City & Activity Discovery)
- **Layout:** Masonry grid of cities.
- **Filters:** Sidebar with "Cost Index" slider, "Popularity" toggle, and "Category" tags (Adventure, Food, Culture).
- **Details Modal:** When clicking a city, show a large glass modal with a "Gemini AI Description," top-rated activities, and a "Add to Trip" button.

### 6. Admin Dashboard (Analytics)
- **KPI Cards:** Total Users, Total Trips Created, AI Generation Count.
- **Visuals:** Dark-themed area charts showing user growth over time.
- **Management:** Table with "User Reports" and "Content Moderation."

---

## 🤖 Detailed Figma/AI Prompt Template

> **Prompt:** "Create a high-fidelity, professional web application design for 'TravelLoop', a collaborative travel planning platform. Use a 'Horizon Luxe' design system featuring deep indigo and teal accents on a dark slate background. Implement glassmorphism with 12px backdrop blur on cards and sidebars. Typography should be 'Inter' with clean, geometric layouts. Focus on a complex 'Trip Planner' screen that includes a vertical itinerary timeline, an integrated map view, and a budget analytics dashboard with sleek Recharts-style visualizations. The overall feel should be premium, expensive, and modern, similar to high-end SaaS productivity tools like Linear or Framer. Avoid clutter; use whitespace and subtle gradients to define sections."

---
