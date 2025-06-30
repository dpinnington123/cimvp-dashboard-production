# Component Architecture Guide

## Overview

This guide documents the component architecture, patterns, and best practices for the Change Influence MVP Dashboard. The application uses React 19 with TypeScript, following modern component design principles.

## Architecture Philosophy

### Core Principles
1. **Separation of Concerns**: Business logic in services/hooks, presentation in components
2. **Composition over Inheritance**: Use component composition and custom hooks
3. **Type Safety**: Full TypeScript coverage with proper interfaces
4. **Reusability**: Build once, use many times
5. **Performance**: Optimize re-renders and bundle size

## Directory Structure

```
src/components/
├── ui/                    # shadcn/ui component library (50+ components)
├── common/               # Shared application components
├── layout/               # Layout and navigation components
├── views/                # Feature-specific components
│   ├── brand-dashboard/
│   ├── brand-strategy/
│   ├── campaign-planner/
│   ├── content-reports/
│   ├── strategic-dashboard/
│   ├── home/
│   └── processContent/
└── brand-profile-builder/  # Brand style guide components
```

## Component Categories

### 1. UI Components (`/ui/`)

The foundation of our design system, powered by shadcn/ui.

#### Key Components
- **Forms**: `form`, `input`, `select`, `textarea`, `checkbox`, `radio-group`
- **Feedback**: `toast`, `alert`, `alert-dialog`, `progress`
- **Layout**: `card`, `separator`, `sheet`, `dialog`, `drawer`
- **Navigation**: `tabs`, `navigation-menu`, `breadcrumb`
- **Data Display**: `table`, `badge`, `avatar`, `tooltip`

#### Usage Example
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <Button className="mt-4">Learn More</Button>
      </CardContent>
    </Card>
  );
}
```

### 2. Common Components (`/common/`)

Reusable application-specific components.

#### Component Inventory

##### LoadingSpinner
```tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Usage
<LoadingSpinner size="lg" />
```

##### ErrorDisplay
```tsx
interface ErrorDisplayProps {
  error: Error | string;
  retry?: () => void;
  className?: string;
}

// Usage
<ErrorDisplay 
  error={error} 
  retry={() => refetch()} 
/>
```

##### StatCard
```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

// Usage
<StatCard
  title="Total Revenue"
  value="$1.2M"
  change={12.5}
  trend="up"
/>
```

##### ChartCard
```tsx
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode; // Chart component
  height?: string;
}

// Usage
<ChartCard title="Performance Trends">
  <LineChart data={data} />
</ChartCard>
```

### 3. Layout Components (`/layout/`)

Application structure and navigation.

#### DashboardLayout
```tsx
interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
}

// Main application wrapper
function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### AppSidebar
```tsx
// Declarative navigation structure
const navigationStructure = [
  {
    title: "Overview",
    items: [
      { 
        title: "Strategic Dashboard", 
        href: "/", 
        icon: LayoutDashboard 
      },
      { 
        title: "Brand Dashboard", 
        href: "/brand-dashboard", 
        icon: TrendingUp 
      }
    ]
  },
  {
    title: "Strategy",
    items: [
      { 
        title: "Brand Strategy", 
        href: "/brand-strategy", 
        icon: Target 
      }
    ]
  }
];
```

### 4. Feature Components (`/views/`)

Business domain-specific components organized by feature.

#### Component Organization Pattern

Each feature follows a consistent structure:

```
feature-name/
├── index.tsx           # Main feature component
├── components/         # Feature-specific components
│   ├── FeatureList.tsx
│   ├── FeatureForm.tsx
│   └── FeatureDetail.tsx
├── hooks/             # Feature-specific hooks
└── types.ts           # Feature types
```

## Component Patterns

### 1. Composition Pattern

Build complex UIs from simple building blocks.

```tsx
// Bad - Monolithic component
function UserProfile({ user, posts, settings }) {
  return (
    <div>
      {/* 500 lines of mixed concerns */}
    </div>
  );
}

// Good - Composed from focused components
function UserProfile({ userId }) {
  return (
    <div className="space-y-6">
      <UserHeader userId={userId} />
      <UserStats userId={userId} />
      <UserPosts userId={userId} />
      <UserSettings userId={userId} />
    </div>
  );
}
```

### 2. Compound Components

Related components that work together.

```tsx
// Card compound component family
<Card>
  <CardHeader>
    <CardTitle>Revenue Overview</CardTitle>
    <CardDescription>Monthly performance metrics</CardDescription>
  </CardHeader>
  <CardContent>
    <RevenueChart />
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### 3. Render Props Pattern

For flexible, reusable logic.

```tsx
interface DataFetcherProps<T> {
  url: string;
  render: (data: T, loading: boolean, error: Error | null) => ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const { data, loading, error } = useFetch<T>(url);
  return <>{render(data, loading, error)}</>;
}

// Usage
<DataFetcher
  url="/api/users"
  render={(users, loading, error) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;
    return <UserList users={users} />;
  }}
/>
```

### 4. Custom Hook Pattern

Extract and share component logic.

```tsx
// Custom hook for form handling
function useFormWithValidation<T>(
  initialValues: T,
  validationSchema: ZodSchema<T>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    setErrors(prev => ({ ...prev, [field]: "" }));
  };
  
  const validate = () => {
    try {
      validationSchema.parse(values);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(/* map zod errors */);
      }
      return false;
    }
  };
  
  return { values, errors, handleChange, validate };
}
```

## State Management in Components

### Local State Pattern
```tsx
function EditableCard({ initialData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  
  // Local state for UI concerns only
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialData); // Reset
  };
  
  // Delegate data persistence to hooks
  const updateMutation = useUpdateData();
  const handleSave = () => {
    updateMutation.mutate(formData, {
      onSuccess: () => setIsEditing(false)
    });
  };
  
  return (
    <Card>
      {isEditing ? (
        <EditForm 
          data={formData}
          onChange={setFormData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <DataDisplay 
          data={formData} 
          onEdit={handleEdit}
        />
      )}
    </Card>
  );
}
```

### Server State Integration
```tsx
function BrandObjectives({ brandId }) {
  // Server state via React Query
  const { data, isLoading, error } = useBrandObjectives(brandId);
  const updateObjective = useUpdateBrandObjective();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div className="space-y-4">
      {data.map(objective => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          onUpdate={(updates) => 
            updateObjective.mutate({ 
              objectiveId: objective.id, 
              updates 
            })
          }
        />
      ))}
    </div>
  );
}
```

## Component Best Practices

### 1. Single Responsibility
Each component should do one thing well.

```tsx
// Bad - Multiple responsibilities
function UserDashboard() {
  // User data fetching
  // Chart rendering
  // Form handling
  // Export functionality
  // 500+ lines
}

// Good - Focused components
function UserDashboard() {
  return (
    <>
      <UserMetrics />
      <UserActivityChart />
      <UserProfileForm />
      <ExportActions />
    </>
  );
}
```

### 2. Props Interface Design
```tsx
// Define clear, typed props
interface ComponentProps {
  // Required props first
  id: string;
  name: string;
  
  // Optional props with defaults
  variant?: "primary" | "secondary"; // = "primary"
  size?: "sm" | "md" | "lg";         // = "md"
  
  // Callbacks
  onChange?: (value: string) => void;
  onSubmit?: (data: FormData) => Promise<void>;
  
  // Children/render props
  children?: ReactNode;
  renderActions?: () => ReactNode;
}
```

### 3. Component Size Guidelines
- **< 100 lines**: Ideal for most components
- **100-200 lines**: Acceptable for complex features
- **200-300 lines**: Consider breaking down
- **> 300 lines**: Must refactor

### 4. File Organization
```tsx
// 1. Imports (grouped by type)
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// External components
import { Card, CardHeader } from "@/components/ui/card";

// Internal components
import { LoadingSpinner } from "@/components/common";

// Hooks
import { useBrandData } from "@/hooks/useBrandData";

// Types
import type { Brand } from "@/types/brand";

// Utils
import { formatCurrency } from "@/utils/format";

// 2. Type definitions
interface ComponentProps {
  // ...
}

// 3. Main component
export function Component({ prop1, prop2 }: ComponentProps) {
  // ...
}

// 4. Sub-components (if needed)
function SubComponent() {
  // ...
}
```

## Styling Guidelines

### Tailwind CSS Usage
```tsx
// Use Tailwind utilities exclusively
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <Badge variant="success">Active</Badge>
</div>

// Conditional classes with cn()
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded-lg font-medium transition-colors",
    "hover:bg-gray-100 focus:outline-none focus:ring-2",
    isActive && "bg-blue-500 text-white hover:bg-blue-600",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
  Click me
</button>
```

### Responsive Design
```tsx
// Mobile-first responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="p-4 md:p-6 lg:p-8">
    <h3 className="text-sm md:text-base lg:text-lg">
      Responsive heading
    </h3>
  </Card>
</div>
```

## Performance Optimization

### 1. Code Splitting
```tsx
// Lazy load heavy components
const HeavyChart = lazy(() => import("./components/HeavyChart"));

function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### 2. Memoization
```tsx
// Only memoize when measurable impact
const ExpensiveList = memo(({ items, filter }) => {
  const filtered = useMemo(
    () => items.filter(item => item.includes(filter)),
    [items, filter]
  );
  
  return (
    <ul>
      {filtered.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});
```

### 3. Event Handler Optimization
```tsx
// Use stable references
function List({ items, onItemClick }) {
  // Bad - Creates new function each render
  return items.map(item => (
    <button onClick={() => onItemClick(item.id)}>
      {item.name}
    </button>
  ));
  
  // Good - Stable reference
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return items.map(item => (
    <Item 
      key={item.id}
      item={item}
      onClick={handleClick}
    />
  ));
}
```

## Testing Components

### Unit Testing Pattern
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("displays title and value", () => {
    render(
      <StatCard 
        title="Revenue" 
        value="$1,234" 
        change={5.2}
        trend="up"
      />
    );
    
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$1,234")).toBeInTheDocument();
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
  });
  
  it("shows correct trend icon", () => {
    const { rerender } = render(
      <StatCard title="Test" value="100" trend="up" />
    );
    expect(screen.getByTestId("trend-up")).toBeInTheDocument();
    
    rerender(<StatCard title="Test" value="100" trend="down" />);
    expect(screen.getByTestId("trend-down")).toBeInTheDocument();
  });
});
```

### Integration Testing
```tsx
import { renderWithProviders } from "@/test-utils";

it("updates brand objective on save", async () => {
  const { user } = renderWithProviders(
    <BrandObjectives brandId="123" />
  );
  
  // Find and click edit button
  const editButton = await screen.findByRole("button", { name: /edit/i });
  await user.click(editButton);
  
  // Update form
  const input = screen.getByLabelText("Objective Title");
  await user.clear(input);
  await user.type(input, "New Objective");
  
  // Save
  const saveButton = screen.getByRole("button", { name: /save/i });
  await user.click(saveButton);
  
  // Verify update
  expect(await screen.findByText("New Objective")).toBeInTheDocument();
});
```

## Component Documentation

### JSDoc for Components
```tsx
/**
 * Displays a statistical metric with optional trend indicator
 * 
 * @example
 * <StatCard 
 *   title="Monthly Revenue"
 *   value="$45,231"
 *   change={12.5}
 *   trend="up"
 *   icon={<DollarSign />}
 * />
 */
interface StatCardProps {
  /** The metric label */
  title: string;
  
  /** The metric value (pre-formatted) */
  value: string | number;
  
  /** Percentage change from previous period */
  change?: number;
  
  /** Trend direction for visual indicator */
  trend?: "up" | "down" | "neutral";
  
  /** Optional icon to display */
  icon?: ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  trend = "neutral",
  icon 
}: StatCardProps) {
  // Implementation
}
```

## Migration Guide

### Refactoring Large Components

For components exceeding 300 lines:

1. **Identify Responsibilities**
   - List all the things the component does
   - Group related functionality

2. **Extract Sub-components**
   ```tsx
   // Before: Everything in one component
   function LargeComponent() {
     // 500 lines handling:
     // - Data fetching
     // - Multiple forms
     // - Charts
     // - Tables
   }
   
   // After: Composed from focused parts
   function RefactoredComponent() {
     return (
       <div>
         <DataProvider>
           <MetricsSection />
           <FormsSection />
           <VisualizationSection />
         </DataProvider>
       </div>
     );
   }
   ```

3. **Extract Custom Hooks**
   - Move data fetching logic to hooks
   - Extract complex state management
   - Share logic between components

4. **Create Compound Components**
   - Group related UI elements
   - Provide consistent APIs
   - Enable flexible composition

### Common Refactoring Patterns

#### Pattern 1: Extract Data Logic
```tsx
// Before
function Component() {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  const processedData = useMemo(() => {
    // Complex processing
  }, [data]);
  
  return <div>{/* UI */}</div>;
}

// After
function Component() {
  const { processedData } = useProcessedData();
  return <div>{/* UI only */}</div>;
}
```

#### Pattern 2: Separate Edit/View Modes
```tsx
// Before: Mixed concerns
function Component({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return isEditing ? (
    // 200 lines of edit form
  ) : (
    // 200 lines of display
  );
}

// After: Separated components
function Component({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return isEditing ? (
    <EditForm data={data} onCancel={() => setIsEditing(false)} />
  ) : (
    <DataDisplay data={data} onEdit={() => setIsEditing(true)} />
  );
}
```

## Future Improvements

### 1. Component Library Documentation
- Storybook integration for component showcase
- Visual regression testing
- Automated documentation generation

### 2. Performance Monitoring
- React DevTools Profiler integration
- Bundle size tracking
- Runtime performance metrics

### 3. Accessibility Enhancements
- ARIA attribute guidelines
- Keyboard navigation patterns
- Screen reader testing

### 4. Advanced Patterns
- Error boundaries for graceful failures
- Suspense for data fetching
- Server Components (React 19)

This architecture provides a solid foundation for building scalable, maintainable React applications while leaving room for growth and optimization.