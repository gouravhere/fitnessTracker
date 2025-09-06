# FitTracker Pro - Fitness and Health Tracking Application

## Overview

FitTracker Pro is a comprehensive fitness and health tracking application that allows users to log workouts, track meals and nutrition, monitor body measurements, and analyze their fitness progress over time. The application features a modern web interface with a dashboard for visualization of fitness data, workout logging with exercise details, meal planning with nutritional tracking, and progress monitoring through body measurements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built using **React 18** with **TypeScript** for type safety. The application uses **Vite** as the build tool and development server, providing fast hot module replacement and optimized builds. The UI components are built with **shadcn/ui** components library, which provides pre-built, accessible React components styled with **Tailwind CSS**.

**State Management**: The application uses **React Query (@tanstack/react-query)** for server state management, caching, and data synchronization. Local component state is managed using React hooks (useState, useForm from react-hook-form).

**Routing**: Client-side routing is handled by **Wouter**, a lightweight routing library that provides declarative routing without the overhead of React Router.

**Form Management**: Forms are managed using **react-hook-form** with **Zod** for schema validation, providing type-safe form handling with automatic validation.

### Backend Architecture

The backend is built with **Express.js** running on **Node.js** with TypeScript. The server follows a RESTful API design pattern with JWT-based authentication.

**Authentication**: Uses **JWT (JSON Web Tokens)** for stateless authentication with **bcrypt** for password hashing. Auth middleware protects sensitive endpoints and extracts user context from tokens.

**API Structure**: RESTful endpoints organized by resource (users, workouts, meals, measurements) with CRUD operations. All endpoints return JSON responses with consistent error handling.

**Development Setup**: The application uses a monorepo structure with shared TypeScript types and schemas between client and server, ensuring type consistency across the full stack.

### Data Storage Solutions

**Database**: **PostgreSQL** is used as the primary database, accessed through **Drizzle ORM** for type-safe database operations. The database connection uses **@neondatabase/serverless** for serverless PostgreSQL hosting.

**Schema Design**: The database schema includes tables for users, workouts, exercises, meals, food items, body measurements, and water intake tracking. All tables use UUID primary keys and include timestamp fields for audit trails.

**Migration Strategy**: Database schema changes are managed through Drizzle Kit migrations, allowing version-controlled database evolution.

### Authentication and Authorization

**JWT Authentication**: Stateless authentication using JSON Web Tokens stored in localStorage on the client side. Tokens include user ID and expiration time.

**Authorization Middleware**: Server-side middleware validates JWT tokens and attaches user context to requests. Protected routes require valid authentication tokens.

**Password Security**: User passwords are hashed using bcrypt with salt rounds for secure storage.

### External Dependencies

**UI Framework**: shadcn/ui component library built on Radix UI primitives provides accessible, customizable components with consistent styling through Tailwind CSS.

**Database Hosting**: Neon Database provides serverless PostgreSQL hosting with connection pooling and automatic scaling.

**Development Tools**: 
- Vite for fast development and optimized production builds
- TypeScript for type safety across the entire stack
- ESLint and Prettier for code quality and formatting
- Drizzle Kit for database migrations and introspection

**Third-party Libraries**:
- date-fns for date manipulation and formatting
- Lucide React for consistent iconography
- class-variance-authority (cva) for component variant management
- clsx and tailwind-merge for conditional CSS classes

**Authentication Dependencies**:
- jsonwebtoken for JWT token creation and verification
- bcrypt for secure password hashing
- jwt-decode for client-side token parsing

The application is designed for deployment on platforms that support Node.js and can connect to PostgreSQL databases, with environment variables managing configuration for different deployment environments.