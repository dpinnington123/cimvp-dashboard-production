# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Build with TypeScript type checking
yarn build:with-types

# Preview production build
yarn preview

# Run linter
yarn lint
```

### Environment Setup
```bash
# Copy environment variables for local development
cp env.example .env.local

# Required environment variables:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## High-Level Architecture

### Project Overview
This is the **Change Influence MVP Dashboard** - a content management and analytics platform built with React 19, TypeScript, and Vite. It provides tools for brand strategy, campaign planning, and content effectiveness analysis.

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: TanStack Query (server state) + React Context (local state)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6

### Directory Architecture
The project uses a hybrid architectural pattern combining feature-based and layer-based organization:

```
src/
├── components/
│   ├── common/         # Shared components (LoadingSpinner, ErrorDisplay)
│   ├── layout/         # Layout components (AppSidebar, DashboardLayout)
│   ├── ui/             # shadcn/ui component library (50+ components)
│   └── views/          # Feature-specific components
│       ├── brand-dashboard/
│       ├── brand-strategy/
│       ├── campaign-planner/
│       ├── content-reports/
│       └── strategic-dashboard/
├── contexts/           # React Context providers (Auth, Brand)
├── hooks/              # Custom React hooks
├── lib/                # Supabase client and utilities
├── pages/              # Route page components
├── services/           # API service layer (Supabase operations)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Architectural Patterns

1. **Service Layer Pattern**: All Supabase operations are abstracted in `/services/`:
   - `contentService.ts` - Content CRUD operations
   - `contentProcessingService.ts` - Content processing workflows
   - `scoreService.ts` - Score calculations
   - `uploadService.ts` - File uploads
   - `exportService.ts` - Export functionality

2. **Authentication Flow**:
   - Supabase Auth with PKCE flow
   - Protected routes via `<ProtectedRoute>` wrapper
   - Auth state managed via `AuthContext` and `useAuth` hook
   - Email verification required

3. **State Management**:
   - Server state: TanStack Query with custom hooks
   - Local state: React Context (AuthContext, BrandContext)
   - No Redux/Zustand - keeping it simple with Context API

4. **Type Safety**:
   - Generated Supabase types from database schema
   - Strict TypeScript configuration
   - Path aliases configured (`@/*` maps to `src/*`)

5. **Component Architecture**:
   - Heavy use of component composition
   - shadcn/ui for base components
   - Feature views organized by business domain
   - Shared components in `/components/common/`

### Important Implementation Details

1. **Multi-Brand Support**: The app supports multiple brands with context switching via `BrandContext`

2. **File Processing**: Content processing happens through:
   - Upload to Supabase Storage
   - Processing via `contentProcessingService`
   - Results stored in PostgreSQL

3. **Export Capabilities**: Supports PDF (jspdf) and PowerPoint (pptxgenjs) exports

4. **Real-time Updates**: Using React Query's refetch and invalidation for data freshness

### Development Guidelines

Follow the comprehensive guidelines in `.cursorrules` which emphasizes:
- Documentation-first approach
- Test-driven development (TDD)
- Small, focused components (< 300 lines)
- DRY principle
- Security-first mindset
- Clear commit messages

**Code Writing Philosophy**: 
- Write only what is absolutely necessary - no extra features, utilities, or code beyond what is specifically requested
- Always include clear, helpful comments that explain what the code is doing for other developers
- Focus on the minimal viable solution that solves the exact problem at hand

### Common Tasks

1. **Adding a new page/route**:
   - Create page component in `/pages/`
   - Add route in `/App.tsx`
   - If protected, wrap with `<ProtectedRoute>`

2. **Adding a new service**:
   - Create service in `/services/`
   - Use consistent error handling pattern
   - Add TypeScript types in `/types/`

3. **Adding a new component**:
   - UI components go in `/components/ui/`
   - Feature components in `/components/views/[feature]/`
   - Shared components in `/components/common/`

4. **Working with Supabase**:
   - Client is initialized in `/lib/supabase.ts`
   - Always use service layer for operations
   - Handle errors consistently

5. **Styling**:
   - Use Tailwind CSS classes
   - Follow shadcn/ui patterns
   - Dark mode is supported via `next-themes`