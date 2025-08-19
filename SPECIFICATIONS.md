# DTL Shot Tracker - Application Specifications

## Overview
DTL Shot Tracker is a French-language mobile-first web application for tracking Down the Line (DTL) trap shooting performance. The app provides comprehensive scoring, equipment management, and performance analytics for competitive trap shooters.

## Core Features

### 1. Authentication System
- **Local Storage Based**: No backend required, uses localStorage for persistence
- **User Registration/Login**: Simple email/password authentication
- **User Management**: Store user profiles with name, email, creation date
- **Session Persistence**: Maintains login state across browser sessions

### 2. Equipment Management
- **Gun Management**: 
  - Store gun details (name, model, specifications)
  - **Over/Under Choke System**: Each gun has two chokes (over and under)
  - Support for detailed gun specifications
- **Cartridge Management**: Track different ammunition types with specifications
- **CRUD Operations**: Add, view, edit, delete equipment
- **Auto-Selection**: Automatically select equipment if only one item exists

### 3. Club Management
- **Club Database**: Store shooting club information
- **Club Details**: Name, location, contact information, notes
- **Performance Tracking**: Track performance statistics per club
- **Integration**: Seamless integration with game scoring

### 4. Live Game Scoring
- **DTL Scoring Rules**:
  - Hit First Shot: 3 points
  - Hit Second Shot: 2 points
  - Miss: 0 points
  - Maximum Score: 75 points (25 shots × 3)
- **4-Click Scoring Cycle**: Empty → 3 → 2 → 0 → Empty
- **25-Shot Grid**: Visual grid organized by 5 stations × 5 shots
- **Real-Time Calculation**: Live score updates and statistics
- **Equipment Selection**: Optional equipment selection with auto-selection
- **Quick Start Mode**: Streamlined interface for rapid game setup

### 5. Game History & Analytics
- **Game Records**: Complete history of all shooting sessions
- **Advanced Filtering**: Filter by date, equipment, club, score range
- **Performance Charts**: Visual representation of progress over time
- **Statistics Dashboard**: Comprehensive performance metrics
- **Equipment Analysis**: Compare performance across different equipment

## Technical Specifications

### Frontend Framework
- **Next.js 14+** with App Router
- **React 18+** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library

### Data Storage
- **Local Storage**: Client-side data persistence
- **No Backend Required**: Fully client-side application
- **Data Models**: Structured TypeScript interfaces

### Mobile Optimization
- **Mobile-First Design**: Optimized for touch devices
- **Responsive Layout**: Adapts to all screen sizes
- **Large Touch Targets**: Minimum 44px touch targets
- **Optimized UX**: Streamlined interface for mobile use

### Internationalization
- **French Language**: All UI text in French
- **Metric System**: All measurements in metric units
- **French Date Formatting**: DD/MM/YYYY format

## Data Models

### User Interface
\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  createdAt: string
}
\`\`\`

### Equipment Interface
\`\`\`typescript
interface Equipment {
  id: string
  userId: string
  name: string
  type: "gun" | "choke" | "cartridge"
  details: string
  // For guns: includes overChoke and underChoke
  overChoke?: string
  underChoke?: string
  createdAt: string
}
\`\`\`

### Game Interface
\`\`\`typescript
interface Game {
  id: string
  userId: string
  date: string
  clubName: string
  equipment: {
    gun?: string
    overChoke?: string
    underChoke?: string
    cartridge?: string
  }
  shots: (number | null)[] // 25 shots: 3, 2, 0, or null (empty)
  totalScore: number
  weather?: string
  notes?: string
  createdAt: string
}
\`\`\`

### Club Interface
\`\`\`typescript
interface Club {
  id: string
  name: string
  location: string
  address?: string
  phone?: string
  email?: string
  website?: string
  notes?: string
  createdAt: string
}
\`\`\`

## User Interface Specifications

### Color Palette
- **Primary**: Deep blue (#1e40af) - Trust and precision
- **Secondary**: Clay orange (#dc2626) - Energy and action
- **Accent**: Success green (#059669) - Positive feedback
- **Neutrals**: Slate color scale for backgrounds and text

### Typography
- **Primary Font**: Inter (sans-serif) for UI elements
- **Monospace Font**: JetBrains Mono for scores and data
- **Font Sizes**: Responsive scale from text-sm to text-3xl

### Layout Principles
- **Mobile-First**: Design starts with mobile, enhances for desktop
- **Card-Based**: Information organized in clean card layouts
- **Tabbed Navigation**: Main features accessible via tabs
- **Generous Spacing**: Minimum 16px between sections
- **Touch-Friendly**: Large buttons and touch targets

## Business Logic

### DTL Scoring System
- **Shot Values**: 3 points (first barrel), 2 points (second barrel), 0 points (miss)
- **Round Structure**: 25 shots per round, organized in 5 stations of 5 shots each
- **Score Calculation**: Sum of all shot values (max 75 points)
- **Performance Metrics**: Hit percentage, first barrel percentage, average score

### Equipment Logic
- **Auto-Selection**: If user has only one item of equipment type, auto-select it
- **Optional Selection**: All equipment fields are optional for quick starts
- **Over/Under Chokes**: Guns support two choke selections (over and under barrels)

### Game Flow
1. **Setup**: Optional equipment and club selection
2. **Scoring**: 25-shot grid with 4-click cycle per shot
3. **Real-Time Updates**: Live score calculation and statistics
4. **Completion**: Automatic game saving when all shots recorded
5. **History**: Game added to user's history with full details

## Performance Requirements
- **Fast Loading**: Optimized for mobile networks
- **Responsive UI**: Smooth interactions on touch devices
- **Offline Capable**: Works without internet connection
- **Data Persistence**: Reliable local storage management

## Security Considerations
- **Client-Side Only**: No sensitive data transmission
- **Local Storage**: Data remains on user's device
- **Input Validation**: Proper form validation and sanitization
- **XSS Prevention**: Safe handling of user input

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful degradation for older browsers

## Deployment
- **Static Hosting**: Can be deployed to any static hosting service
- **Vercel Recommended**: Optimized for Vercel deployment
- **No Backend Required**: Pure frontend application
- **CDN Friendly**: All assets can be cached

## Future Enhancements
- **Data Export**: Export game data to CSV/JSON
- **Cloud Sync**: Optional cloud backup of data
- **Multi-Language**: Support for additional languages
- **Advanced Analytics**: More detailed performance insights
- **Social Features**: Share scores and compete with friends

## Development Guidelines
- **TypeScript**: Strict typing throughout the application
- **Component Architecture**: Reusable, modular components
- **State Management**: React hooks for local state
- **Error Handling**: Comprehensive error boundaries and validation
- **Testing**: Unit tests for critical business logic
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized bundle size and loading times

This specification provides a complete blueprint for recreating the DTL Shot Tracker application with all its features, technical requirements, and design principles.
