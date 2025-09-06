# Natural Aesthetics - Fitness and Health Tracking Application

Natural Aesthetics is a user-friendly app that helps you keep track of workouts, meals, body measurements, and your overall fitness progress. With a clean dashboard, easy-to-use forms, and simple navigation, you’ll find all the tools you need to stay healthy and reach your goals.

---

## Features

- **Personal Dashboard:** Visualize your fitness data as soon as you log in.
- **Workout Logging:** Add workouts, exercises, sets, reps, and duration details.
- **Meal & Nutrition Tracking:** Log meals, track calories & macros, and plan your nutrition.
- **Progress Monitoring:** Record and analyze body measurements and water intake.
- **Weekly/Monthly Reports:** Get summaries and insights into your progress.
- **Responsive Design:** Looks and works great on mobile and desktop.
- **Secure Authentication:** JWT-based login system keeps your data safe.

---

## System Architecture

### Frontend

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (fast dev server & optimized builds)
- **UI Library:** shadcn/ui (built on Radix UI), styled with Tailwind CSS
- **Routing:** Wouter (lightweight and fast)
- **State Management:** React Query (`@tanstack/react-query`) for server state; React hooks for local state
- **Forms:** react-hook-form + Zod for easy, type-safe validation

### Backend

- **Framework:** Express.js + Node.js + TypeScript
- **API Design:** RESTful endpoints for users, workouts, meals, and measurements
- **Authentication:** JWT tokens (stateless), bcrypt for password security
- **Database:** PostgreSQL (via Neon Database / serverless)
- **ORM:** Drizzle ORM for type-safe DB operations
- **Migrations:** Drizzle Kit for version-controlled schema changes

### Shared

- **Monorepo Structure:** Shared TypeScript types and schemas between frontend and backend for consistency

---

## Database Schema

- Users
- Workouts
- Exercises
- Meals & Food Items
- Body Measurements
- Water Intake
- All tables use UUID as primary keys and have timestamps for audit trails

---

## External Dependencies

- **UI:** shadcn/ui, Radix UI, Tailwind CSS, Lucide React (icons)
- **Database Hosting:** Neon Database (serverless PostgreSQL)
- **Date Handling:** date-fns
- **Component Styling:** clsx, tailwind-merge, class-variance-authority (cva)
- **Authentication:** jsonwebtoken, bcrypt, jwt-decode

---

## Development Tools

- Vite (dev server/build)
- TypeScript (type safety everywhere)
- ESLint + Prettier (code quality)
- Drizzle Kit (migrations)
- Zod (validation)

---

## Getting Started

### Prerequisites

- Node.js & npm/yarn
- PostgreSQL database (Neon Database recommended)

### Installation

```bash
git clone https://github.com/gouravhere/fitnesspal.git
cd fitnesspal
npm install
```

### Environment Setup

Make a `.env` file in the project root and add:

```
JWT_SECRET=your_jwt_secret
DB_URI=your_database_url
```

### Running the App

```bash
npm run dev
```

Frontend will be at `http://localhost:3000` and backend at `http://localhost:4000` (or as configured).

---

## Usage

1. Sign up or log in.
2. Start logging workouts, meals, and measurements.
3. Track your progress on the dashboard.
4. View weekly or monthly reports.

---

## License

MIT

---

**Author:** [gouravhere](https://github.com/gouravhere)

---

*Feel free to open issues or contribute!*
