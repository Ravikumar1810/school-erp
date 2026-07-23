# School ERP — Smart School Management System

A modern, full-stack School ERP application designed to simplify academic management and provide dedicated role-based experiences for Principals, Teachers, and Students.

The platform provides secure authentication, student and teacher management, attendance tracking, marks management, academic analytics, user profiles, and role-specific dashboards through a responsive and production-ready web application.

## Live Application

- Frontend: https://school-erp-two-olive.vercel.app/
- Backend API: https://school-erp-api-jom1.onrender.com/

## Overview

School ERP is a full-stack role-based school management platform built using a modern TypeScript ecosystem.

The application provides three primary user roles:

- **Principal (Super Admin)** — Manages teachers and students, monitors attendance and marks, accesses school-wide analytics, and manages their profile.
- **Teacher (Admin)** — Manages assigned academic workflows including students, attendance, marks, and profile information.
- **Student** — Views personal attendance, academic marks, dashboard statistics, and profile information.

Each role has a dedicated dashboard and protected routes to ensure users can only access authorized resources.

## Key Features

### Authentication & Security

- JWT-based authentication
- Access and refresh token support
- Role-based authorization
- Protected frontend and backend routes
- Secure password hashing using bcrypt
- Login and logout functionality
- Forgot password flow
- Reset password flow
- Change password functionality
- User account status validation
- Role-specific route protection

### Principal Dashboard

- View real-time school dashboard statistics
- Manage teachers
- Manage students
- View attendance records
- View academic marks
- Access school-wide analytics
- Monitor attendance trends
- Monitor academic performance
- View class performance insights
- Manage personal profile
- Change account password

### Teacher Dashboard

- View role-specific dashboard statistics
- Manage students
- Record and view attendance
- Add and manage student marks
- Access student profiles
- Manage personal profile
- Change account password

### Student Dashboard

- View personal dashboard statistics
- View personal attendance records
- View academic marks
- Monitor subject performance
- View attendance percentage
- View average academic performance
- Manage personal profile
- Change account password

### Analytics

The Principal dashboard includes an analytics module that provides insights into school academic data, including:

- Attendance analytics
- Academic performance analytics
- Class performance analytics
- Summary statistics

Dashboard and analytics information is retrieved dynamically from PostgreSQL rather than relying on hard-coded values.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Axios
- TanStack Query
- Lucide React

### Backend

- NestJS
- TypeScript
- JWT Authentication
- Passport.js
- bcrypt
- Class Validator
- Class Transformer

### Database

- PostgreSQL
- Drizzle ORM
- Drizzle Kit

### Monorepo & Tooling

- pnpm Workspaces
- Turborepo
- ESLint
- Prettier
- TypeScript

### Deployment

- Frontend — Vercel
- Backend — Render
- Database — PostgreSQL on Render

## Project Architecture

The project follows a monorepo architecture managed with pnpm Workspaces and Turborepo.

```text
school-erp/
├── apps/
│   ├── api/                 # NestJS backend application
│   └── web/                 # Next.js frontend application
│
├── packages/                # Shared monorepo packages
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Frontend Structure

The frontend uses the Next.js App Router with route groups for authentication, landing pages, and dashboards.

```text
apps/web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/
│   │   ├── super-admin/
│   │   ├── admin/
│   │   └── student/
│   │
│   └── (landing)/
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── dashboard/
│   ├── forms/
│   ├── landing/
│   └── ui/
│
├── config/
├── constants/
├── hooks/
├── lib/
├── providers/
├── schemas/
├── services/
└── types/
```

The frontend architecture separates UI components, forms, validation schemas, API services, authentication logic, and role-based dashboard components for maintainability and scalability.

## Backend Structure

The NestJS backend follows a modular architecture.

```text
apps/api/src/
├── common/
│   ├── decorators/
│   ├── enums/
│   └── guards/
│
├── config/
├── database/
│   ├── migrations/
│   └── schema/
│
├── modules/
│   ├── analytics/
│   ├── attendance/
│   ├── auth/
│   ├── dashboard/
│   ├── mail/
│   ├── marks/
│   ├── profile/
│   ├── students/
│   ├── teachers/
│   └── users/
│
├── app.module.ts
└── main.ts
```

Each major domain is implemented as an independent NestJS module to maintain separation of concerns.

## Role-Based Access Control

The application supports three user roles:

| Role | Application Access |
| --- | --- |
| Super Admin | Principal dashboard, teachers, students, attendance, marks, analytics, profile |
| Admin | Teacher dashboard, students, attendance, marks, profile |
| Student | Student dashboard, personal attendance, personal marks, profile |

Authentication and authorization are enforced at both frontend and backend levels.

Users attempting to access unauthorized dashboard routes are redirected according to their authenticated role.

## Authentication Flow

The authentication system uses JWT access and refresh tokens.

The general authentication flow is:

1. User logs in using registered credentials.
2. The backend validates the email and password.
3. The backend generates access and refresh tokens.
4. The frontend stores authentication tokens.
5. Protected API requests include authentication credentials.
6. The backend JWT guard validates protected requests.
7. Role guards restrict access to role-specific resources.
8. Users can securely log out and invalidate their stored refresh token.

## Password Reset Flow

The application includes forgot-password and reset-password functionality.

The flow is:

1. User enters their registered email address.
2. The backend verifies the account.
3. A secure password-reset token is generated.
4. The reset token is stored with an expiration time.
5. A password-reset link is generated for the frontend reset page.
6. The user submits a new password.
7. The backend validates the reset token.
8. The new password is securely hashed.
9. The reset token is invalidated after successful use.

For production environments, valid user email addresses should be used when accounts are created to support email-based account recovery.

## Database

The application uses PostgreSQL with Drizzle ORM.

Database schemas include application data for:

- Users
- Students
- Attendance
- Marks

Database migrations are managed using Drizzle Kit.

## Environment Variables

Create the required environment files before running the project locally.

### Backend

Create:

```text
apps/api/.env
```

Required variables:

```env
PORT=
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=

FRONTEND_URL=

RESEND_API_KEY=
MAIL_FROM=
```

### Frontend

Create:

```text
apps/web/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=
```

Example for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> Never commit `.env` or `.env.local` files containing production credentials, database URLs, JWT secrets, or API keys.

## Local Development

### Prerequisites

Make sure the following tools are installed:

- Node.js
- pnpm
- PostgreSQL
- Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd school-erp
```

### Install Dependencies

From the project root:

```bash
pnpm install
```

### Configure Environment Variables

Configure the backend:

```text
apps/api/.env
```

Configure the frontend:

```text
apps/web/.env.local
```

### Database Setup

After configuring `DATABASE_URL`, run the required Drizzle database commands from the API application.

```bash
cd apps/api
pnpm db:migrate
```

If database seeding is required:

```bash
pnpm db:seed
```

Return to the project root:

```bash
cd ../..
```

### Start Development Environment

From the project root:

```bash
pnpm dev
```

Alternatively, the applications can be started individually.

Backend:

```bash
cd apps/api
pnpm start:dev
```

Frontend:

```bash
cd apps/web
pnpm dev
```

The local applications are typically available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
```

## Production Build

Build the entire monorepo:

```bash
pnpm build
```

The applications can also be built individually.

Backend:

```bash
pnpm --filter api build
```

Frontend:

```bash
pnpm --filter web build
```

## Production Deployment

The application is deployed using separate frontend, backend, and database services.

### Frontend

The Next.js frontend is deployed on Vercel.

Production URL:

```text
https://school-erp-two-olive.vercel.app/
```

### Backend

The NestJS API is deployed on Render.

Production URL:

```text
https://school-erp-api-jom1.onrender.com/
```

### Database

The production application uses PostgreSQL hosted on Render.

Production secrets and database credentials are configured using deployment environment variables and are not stored in the repository.

## Responsive Design

The application is designed to work across multiple screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The dashboard includes responsive navigation behavior, including a mobile-friendly sidebar and adaptive layouts.

## Performance & Production Readiness

The application has been tested using production builds for both the frontend and backend.

Production verification includes:

- Frontend production build
- Backend production build
- Production API connectivity
- PostgreSQL database connectivity
- Role-based authentication
- Protected route access
- Dashboard data retrieval
- Responsive layouts
- Mobile compatibility
- Production frontend and backend deployment

## Security Considerations

The project implements several application security practices:

- Password hashing with bcrypt
- JWT authentication
- Access and refresh tokens
- Role-based authorization
- Backend authentication guards
- Protected frontend routes
- Password-reset token expiration
- Environment-based secret configuration
- Input validation
- User account status validation

Sensitive credentials and production environment variables should never be committed to version control.

## Future Improvements

Given additional development time, the platform could be extended with:

- Parent-specific accounts and dashboards
- Advanced class and section management
- Subject and timetable management
- Assignment and examination modules
- Fee and payment management
- Report card generation
- Advanced notification system
- Email notifications
- File and document uploads
- Audit logs
- More detailed analytics and reporting
- Automated testing and expanded end-to-end test coverage
- Docker-based deployment
- CI/CD workflows

## Project Status

The core School ERP application is complete and deployed with:

- Role-based authentication
- Principal dashboard
- Teacher dashboard
- Student dashboard
- Student management
- Teacher management
- Attendance management
- Marks management
- Academic analytics
- Profile management
- Password management
- PostgreSQL integration
- Responsive user interface
- Production frontend deployment
- Production backend deployment

## Author

**Ravi Kumar N K**

Full Stack Developer

---

This project was developed as a full-stack School ERP application demonstrating modern frontend development, backend API architecture, relational database integration, authentication, authorization, responsive design, and production deployment.