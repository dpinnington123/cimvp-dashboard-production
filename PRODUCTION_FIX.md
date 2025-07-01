# Production Deployment Fix Guide

## Immediate Actions Required

### 1. Add Environment Variables in Vercel Dashboard

Go to your Vercel project settings and add these environment variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_DATABASE_BRANDS=true
```

**Important**: Set `VITE_USE_DATABASE_BRANDS=true` to use database content instead of static fallback.

### 2. Install Missing Dependencies

Some UI component dependencies are missing. Run:

```bash
yarn add @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-radio-group @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-toast embla-carousel-react react-resizable-panels vaul input-otp
```

### 3. Deploy Steps

1. Ensure all environment variables are set in Vercel
2. Commit and push the dependency fixes
3. Trigger a new deployment

### 4. TypeScript Issues (Fix Later)

The app has TypeScript errors that need fixing:
- Field name mismatches (camelCase vs snake_case)
- Missing type definitions
- Component prop errors

These don't block deployment since we're using `yarn build` (without TypeScript checking).

### 5. Verify Deployment

After deployment:
1. Check browser console for any 404 errors
2. Verify Supabase connection works
3. Ensure brand data loads correctly