# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎓 Educational Approach - IMPORTANT

**The user is learning to code and wants to understand everything you do.** When working on this codebase:

1. **Explain Every Decision**: Before making changes, explain:
   - What you're about to do and why
   - What alternatives exist and why you chose this approach
   - Any trade-offs or considerations

2. **Break Down Complex Concepts**: When you encounter:
   - New patterns or techniques
   - Framework-specific features
   - Best practices or conventions
   - Explain them in simple terms with analogies when helpful

3. **Provide Learning Context**: For each code change:
   - Explain what the code does
   - Point out important patterns or concepts being used
   - Suggest resources or terms to research for deeper understanding

4. **Use Clear, Professional Comments**: Keep code comments descriptive and helpful:
   ```javascript
   // Fetch brand data with caching and automatic refetching
   const useBrandData = (brandId: string) => {
     return useQuery({
       queryKey: ['brand', brandId],
       queryFn: () => brandService.getBrand(brandId),
     });
   };
   ```

5. **Explain the "Why" Not Just the "What"**:
   - Bad: "I'm adding a try-catch block"
   - Good: "I'm adding a try-catch block here to handle potential errors when fetching data. This prevents the app from crashing and lets us show a friendly error message to users instead"

6. **Connect to Bigger Picture**: Show how changes fit into:
   - The overall architecture
   - Common web development patterns
   - Industry best practices

## Table of Contents
1. [Educational Approach](#educational-approach)
2. [Project Philosophy & Constraints](#philosophy)
3. [Essential Commands](#commands)
4. [Git Workflow](#git-workflow)
5. [Technology Stack](#tech-stack)
6. [Directory Architecture](#directory-architecture)
7. [Key Architectural Patterns](#patterns)
8. [Anti-Patterns to Avoid](#anti-patterns)
9. [Testing Philosophy](#testing)
10. [Common Tasks](#common-tasks)

## Project Philosophy & Constraints <a name="philosophy"></a>

**This section defines the core rules and principles for this project:**

1. **Dependency Policy**: 
   - Do NOT add new dependencies without explicit approval
   - Always check if existing libraries can solve the problem first
   - If a new dependency is needed, explain why and propose it first

2. **Code Style & Quality**:
   - Follow existing patterns in the codebase
   - Run `yarn lint` before committing any changes
   - Keep components under 300 lines
   - Extract reusable logic into hooks or utilities

3. **Architectural Mandates**:
   - Business logic MUST reside in the `/services` layer
   - Components should only handle presentation and user interaction
   - All Supabase operations go through the service layer
   - Use TanStack Query for server state, Context for local state

4. **Performance Requirements**:
   - Lazy load route components
   - Use React.memo sparingly and only when measurable impact
   - Images should be optimized before upload

5. **Security First**:
   - Never expose API keys or secrets in code
   - All user inputs must be validated with Zod
   - Use Row Level Security (RLS) in Supabase
   - Sanitize any user-generated content

## Essential Commands <a name="commands"></a>

### Development Workflow (Golden Path)
```bash
# 1. Install dependencies
yarn install

# 2. Start development server
yarn dev

# 3. Run linter before committing
yarn lint

# 4. Build for production (includes type checking)
yarn build:with-types

# 5. Preview production build locally
yarn preview
```

### Additional Commands
```bash
# Run TypeScript compiler check only
yarn tsc --noEmit

# Clean build artifacts
rm -rf dist

# Update dependencies (use with caution)
yarn upgrade-interactive
```

### Environment Setup
```bash
# Copy environment variables for local development
cp env.example .env.local

# Required environment variables:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_PROJECT_ID=gbzrparwhkacvfasltbe (for Supabase MCP tool)
```

### Development Login Credentials
```
# Local development login
Email: farlen@enny.ai
Password: someshit1989

# Access the app at: http://localhost:5173
```

## Git Workflow <a name="git-workflow"></a>

### Regular Commit and Push Practice

**IMPORTANT: Claude should regularly commit and push changes to maintain a clean git history and prevent data loss.**

#### When to Commit
1. **After each logical unit of work**:
   - Completing a feature or bug fix
   - Finishing a component implementation
   - Making significant structural changes
   - Refactoring code sections

2. **Before major changes**:
   - Creating a checkpoint before risky modifications
   - Before switching to work on a different feature
   - Before experimental changes

#### Commit Workflow
```bash
# 1. Check current status to see what has changed
git status

# 2. Review the actual changes
git diff

# 3. Add specific files (recommended) or all changes
git add [specific-files]  # Preferred: Add specific files
# OR
git add .  # Add all changes (use with caution)

# 4. Create a descriptive commit
git commit -m "feat: Add user authentication flow

- Implement login/logout functionality
- Add session management
- Create protected route wrapper"

# 5. Push to remote repository
git push origin feature/database-schema-setup
```

#### Commit Message Format
Follow conventional commits specification:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat: Add campaign dashboard filtering"
git commit -m "fix: Resolve date formatting in reports"
git commit -m "refactor: Extract reusable chart components"
```

#### Best Practices
1. **Commit frequently**: Small, focused commits are better than large, complex ones
2. **Write clear messages**: Future developers (including yourself) will thank you
3. **Test before committing**: Run `yarn lint` and ensure the app builds
4. **Never commit secrets**: Double-check for API keys or sensitive data
5. **Push regularly**: Don't let local commits pile up - push to remote often
6. **No AI attribution**: Never include "Generated with Claude Code" or similar AI attribution in commit messages

#### Educational Note for Learning Developers
Regular commits serve multiple purposes:
- **Version Control**: Each commit is a snapshot you can return to
- **Collaboration**: Others can see your progress and changes
- **Documentation**: Commit messages document the evolution of the code
- **Safety Net**: If something breaks, you can revert to a working state

## High-Level Architecture

### Project Overview
This is the **Change Influence MVP Dashboard** - a content management and analytics platform built with React 19, TypeScript, and Vite. It provides tools for brand strategy, campaign planning, and content effectiveness analysis.

### Technology Stack <a name="tech-stack"></a>
- **Frontend**: React 19 + TypeScript 5.7 + Vite 6.0
  - React 19: Latest features including improved SSR and concurrent features
  - TypeScript: Type safety and better developer experience
  - Vite: Lightning-fast HMR and optimized builds
  
- **Backend**: Supabase (PostgreSQL 15 + Auth + Storage)
  - Chosen for rapid development, built-in auth, and real-time capabilities
  - Row Level Security (RLS) for data protection
  
- **Styling**: Tailwind CSS v4 + shadcn/ui components
  - Tailwind v4: Utility-first CSS with improved performance
  - shadcn/ui: Copy-paste components that we own and can customize
  
- **State Management**: 
  - TanStack Query v5: Server state caching and synchronization
  - React Context: Simple local state (no Redux needed for this scale)
  
- **Forms**: React Hook Form v7 + Zod v3
  - RHF: Performant forms with minimal re-renders
  - Zod: Type-safe schema validation
  
- **Routing**: React Router v6
  - Industry standard with great TypeScript support

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
   - `brandService.ts` - **Enhanced brand management and analytics** 
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

1. **Enhanced Brand Management**: Complete brand analytics platform with:
   - **Market Analysis** - Market size, growth rates, competitive landscape
   - **Customer Intelligence** - Segmentation, journey mapping, personas with scoring
   - **Performance Tracking** - Historical metrics, channel-specific scores, funnel data
   - **Content Management** - Campaign-linked content with multi-dimensional scoring
   - **SWOT Analysis** - Comprehensive competitive positioning

2. **Multi-Brand Support**: The app supports multiple brands with context switching via `BrandContext`

3. **File Processing**: Content processing happens through:
   - Upload to Supabase Storage
   - Processing via `contentProcessingService`
   - Results stored in PostgreSQL

4. **Export Capabilities**: Supports PDF (jspdf) and PowerPoint (pptxgenjs) exports

5. **Real-time Updates**: Using React Query's refetch and invalidation for data freshness

6. **Database Architecture**: Dual-mode support:
   - **Database Mode** (`VITE_USE_DATABASE_BRANDS=true`) - Production-ready with 20+ tables
   - **Static Mode** (`VITE_USE_DATABASE_BRANDS=false`) - Development fallback

## Anti-Patterns to Avoid <a name="anti-patterns"></a>

**❌ These patterns are explicitly forbidden in this codebase:**

1. **Data Fetching Anti-Patterns**:
   - ❌ Never use `useEffect` for data fetching - use TanStack Query hooks
   - ❌ Don't make direct Supabase calls in components - use the service layer
   - ❌ Avoid storing server data in component state - let TanStack Query handle it

2. **State Management Anti-Patterns**:
   - ❌ Don't use Redux or Zustand - we use Context API for simplicity
   - ❌ Avoid prop drilling beyond 2 levels - use Context instead
   - ❌ Never store sensitive data in localStorage - use secure session storage

3. **Component Anti-Patterns**:
   - ❌ Don't create components over 300 lines - split into smaller pieces
   - ❌ Avoid inline styles - use Tailwind CSS classes
   - ❌ Never import CSS files - all styling via Tailwind

4. **Security Anti-Patterns**:
   - ❌ Never hard-code API keys or secrets
   - ❌ Don't trust user input - always validate with Zod
   - ❌ Avoid direct DOM manipulation - use React's declarative approach

5. **Performance Anti-Patterns**:
   - ❌ Don't use React.memo without measuring impact
   - ❌ Avoid large bundle imports - use dynamic imports for heavy libraries
   - ❌ Never load all data at once - implement pagination

## Testing Philosophy <a name="testing"></a>

**Our testing approach focuses on confidence and maintainability:**

1. **What to Test**:
   - Business logic in `/services` - unit tests with Jest
   - Critical user flows - integration tests with React Testing Library
   - Component interactions - focus on user behavior, not implementation

2. **Test Organization**:
   - Test files co-located: `ComponentName.test.tsx`
   - Test utilities in `/tests/utils`
   - Mock data in `/tests/mocks`

3. **Testing Guidelines**:
   - Write tests that give confidence the feature works
   - Don't test implementation details
   - Use MSW for API mocking, not manual fetch mocks
   - Aim for 80% coverage on critical paths, not 100% everywhere

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

4. **Working with Brand Data**:
   - Use `brandService.ts` for all brand operations
   - Access via `brand_full_data` view for efficient queries
   - Support for market analysis, competitors, SWOT, customer segments
   - Historical performance tracking and persona management

5. **Working with Supabase**:
   - Client is initialized in `/lib/supabase.ts`
   - Always use service layer for operations
   - Handle errors consistently

6. **Styling**:
   - Use Tailwind CSS classes
   - Follow shadcn/ui patterns
   - Dark mode is supported via `next-themes`