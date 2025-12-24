# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (App Router) web application for a DeFi strategy management platform built with React 19, TypeScript, and Tailwind CSS. The app uses Privy for authentication and features a dashboard for managing wallets, assets, strategies, subscriptions, and subscribers.

## Development Commands

```bash
# Start development server
bun dev

# Build for production
bun run build

# Run production build
bun start

# Lint code
bun run lint
```

## Architecture & Design Patterns

### Component Organization

The codebase follows a modular component structure:

- **Page Components** (`src/app/`): Next.js App Router pages with client-side interactivity
- **Feature Components** (`src/components/`): Organized by feature domain (assets, wallets, strategies, subscriptions, subscribers)
- **Layout Components** (`src/components/layouts/`): Reusable layout patterns
- **Shared Components** (`src/components/ui/`, `src/components/common/`): UI primitives and common elements

### Key Architectural Patterns

#### 1. Split Panel Layout Pattern
The app uses a reusable `SplitPanelLayout` component for list-detail views:
- Main content centered at 60% viewport width
- Slides left when detail panel opens (40% width)
- Smooth animations using framer-motion
- Used in: assets, wallets, strategies, subscriptions, subscribers pages

Example usage:
```tsx
<SplitPanelLayout
  backUrl="/app/dashboard"
  title="Page Title"
  subtitle="// page subtitle"
  isPanelOpen={!!selectedItem}
  sidePanel={selectedItem && <DetailPanel />}
>
  <ItemList />
</SplitPanelLayout>
```

#### 2. Row + Detail Panel Pattern
Each feature domain has:
- **Row Component**: Displays list item with hover animations (e.g., `AssetRow`, `WalletRow`)
- **Detail Panel Component**: Slide-in panel showing full details (e.g., `WalletDistributionPanel`, `AssetDistributionPanel`)

#### 3. Next.js 15+ Params Handling
**IMPORTANT**: All dynamic route params are Promises and must be unwrapped:
```tsx
// Correct
const MyPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  // ...
}

// Wrong - will cause errors
const MyPage = ({ params }: { params: { id: string } }) => {
  const id = params.id; // Error!
}
```

### Routing Structure

```
/app/dashboard          - Main dashboard with overview cards
/app/dashboard/assets   - Assets list with wallet distribution
/app/dashboard/wallets  - Wallets list with asset distribution
/app/dashboard/strategies - User-created strategies (legacy, redirects to /app/strategies)
/app/dashboard/subscriptions - User subscriptions
/app/dashboard/subscribers - Strategy subscribers
/app/dashboard/actions  - Activity feed

/app/strategies         - All strategies list
/app/strategies/[id]    - Strategy detail page (bento grid layout)
```

### Data Flow

- **Dummy Data**: All data currently comes from `src/constants/data.ts`
- **Types**: TypeScript interfaces in `src/types/index.ts`
- **State Management**: React `useState` for local component state
- **No global state management** (Redux, Zustand, etc.) currently implemented

### Styling Conventions

- **Tailwind CSS**: Utility-first styling with custom theme (Tailwind v4)
- **Color Scheme**: Dark theme with neutral grays and primary accent color
- **Animations**: framer-motion for smooth transitions
- **Component Variants**:
  - Cards use `bg-neutral-800` or `bg-neutral-900`
  - Borders: `border-neutral-700`, hover: `border-primary/50` or `hover:border-neutral-600`
  - Text hierarchy: white → `text-white/70` → `text-white/50` → `text-white/40`
- **Spacing**:
  - List spacing: `space-y-2` between rows
  - Card padding: `p-3` for compact items, `p-6` for main cards (via `CardLayout`)
  - Section spacing: `space-y-4` or `space-y-6`
- **Typography**:
  - Headers: `text-xs text-white/50` for labels, `uppercase` for titles
  - Content: `text-sm` for primary text, `text-xs` for secondary
  - Comments: `// comment text` format for section headers

### Strategy Detail Page

The `/app/strategies/[id]` page uses a linear card layout with modular components:
- Full width (`w-full max-w-5xl mx-auto`) centered container
- Each card is a separate component in `src/components/strategies/card/`:
  - `StrategyInfoCard` - Strategy details with status indicator (top-right absolute position)
  - `StrategySubscribersCard` - List of subscribers
  - `StrategyWalletCard` - Delegated wallet with expandable assets
  - `StrategyActionsCard` - Recent wallet actions
- All cards use the `CardLayout` wrapper component for consistent styling

### Authentication

- Uses Privy (`@privy-io/react-auth`) for wallet authentication
- Provider setup in `src/components/providers/privy-provider.tsx`
- Wrapped at root level in `layout.tsx`

### Important Implementation Notes

1. **Asset Aggregation**: Assets are aggregated across wallets using the `aggregateAssets` helper in `data.ts`
2. **Wallet Actions**: Filtered by wallet name matching in action descriptions
3. **Subscriptions**: Linked to strategies by name matching (no direct strategyId)
4. **Subscriber Data**: Does NOT include invested amounts (privacy consideration)

### Card Component Pattern

All cards should use the `CardLayout` wrapper component:
```tsx
import CardLayout from "@/components/layouts/card-layout";

<CardLayout>
  {/* Card content with p-6 padding, bg-neutral-900, and hover effects */}
</CardLayout>
```

The `CardLayout` provides:
- Consistent padding (`p-6`)
- Background color (`bg-neutral-900`)
- Border with hover effect (`hover:border-primary`)
- Vertical spacing (`space-y-4`)

### Component Creation Guidelines

**For List-Detail Pages:**
1. Create Row component in `src/components/[feature]/` (e.g., `AssetRow`, `WalletRow`, `ActionRow`)
2. Create Detail Panel component in same directory
3. Create page in `src/app/app/dashboard/[feature]/`
4. Use `SplitPanelLayout` for consistent UX
5. Add navigation link to dashboard card

**For Complex Detail Pages:**
1. Break down large pages into smaller card components
2. Place card components in `src/components/[feature]/card/`
3. Each card should be self-contained with clear props interface
4. Use `CardLayout` wrapper for all cards
5. Keep main page file clean and readable (< 150 lines)

### Animation Standards

- Use `framer-motion` for all animations
- Transitions: `type: "spring", stiffness: 300, damping: 30`
- Fade-ins: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- Stagger delays: `delay: index * 0.05` for list items
