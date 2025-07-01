# Change Influence MVP Dashboard

A comprehensive content management and analytics platform for brand strategy and campaign planning.

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.7 + Vite 6.0
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: TanStack Query v5 + React Context

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   
4. Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn build:with-types` - Build with TypeScript checking
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

### Project Structure

```
src/
├── components/      # UI components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utilities and Supabase client
├── pages/           # Route pages
├── services/        # API service layer
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Features

- **Brand Management**: Create and manage multiple brands
- **Strategic Planning**: Define objectives, messages, and target audiences
- **Campaign Planning**: Plan and track marketing campaigns
- **Content Analysis**: Upload and analyze content effectiveness
- **Market Intelligence**: Competitor analysis and market insights
- **Export Capabilities**: Export data as PDF or PowerPoint

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The project includes `vercel.json` for proper client-side routing configuration.

## Documentation

For detailed developer documentation, see the `/docs` directory:
- [Developer Guide](./docs/guides/DEVELOPER_GUIDE.md)
- [Service Layer Guide](./docs/guides/SERVICE_LAYER_GUIDE.md)
- [Authentication & Security Guide](./docs/guides/AUTHENTICATION_SECURITY_GUIDE.md)

## License

Proprietary - All rights reserved