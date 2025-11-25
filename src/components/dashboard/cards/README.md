# Dashboard Card Components

This directory contains reusable card components for the dashboard page, extracted from the original monolithic NewDashboardHome.tsx component.

## Components

### LearningPathCard
A reusable component for displaying learning path cards with progress indicators and action buttons.

**Props:**
- `path: LearningPath` - The learning path data
- `index: number` - Index for animations
- `onContinue?: (pathId: string) => void` - Callback for continue learning

### QuickActionCard
A reusable component for displaying quick action cards with hover effects and animations.

**Props:**
- `action: QuickAction` - The quick action data
- `index: number` - Index for animations
- `onActionClick?: (actionId: string) => void` - Callback for action clicks

### StatsCard
A reusable component for displaying user statistics in a grid layout.

**Props:**
- `stats: Stat[]` - Array of stat objects to display

### ActivityCard
A reusable component for displaying recent activities.

**Props:**
- `activities: RecentActivity[]` - Array of activity objects
- `onViewAll?: () => void` - Callback for view all button

### CommunityRoomCard
A reusable component for displaying practice room information.

**Props:**
- `rooms: PracticeRoom[]` - Array of room objects
- `onBrowseAll?: () => void` - Callback for browse all button

## Usage

```tsx
import { LearningPathCard, QuickActionCard, StatsCard } from '@/components/dashboard/cards';

// In your component
<LearningPathCard path={pathData} index={0} onContinue={handleContinue} />
<StatsCard stats={userStats} />
```

## Benefits

- **Reusability**: Components can be used across different parts of the dashboard
- **Maintainability**: Easier to modify individual card styles and behavior
- **Consistency**: Ensures uniform styling across all dashboard cards
- **Performance**: Smaller component bundles and better tree shaking
