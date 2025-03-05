# HabitFlow - Vue 3 Habit Tracking Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive habit tracking application built with Vue 3, TypeScript, and Tailwind CSS. This project demonstrates proficiency in modern frontend development practices, state management, and user experience design.

**Repository**: https://github.com/dina0elsergani/habit-tracker-vue

## 🚀 Features

- **Habit Management**: Create, edit, and delete habits with custom frequencies (daily/weekly)
- **Visual Progress Tracking**: Calendar view with completion status and streak counters
- **Smart Analytics**: Real-time statistics including completion rates, current/longest streaks, and best weeks
- **Responsive Design**: Mobile-first design with dark mode support
- **Local Storage**: Data persistence using browser localStorage
- **Modern UI/UX**: Smooth animations, hover effects, and intuitive navigation

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **UI Components**: Headless UI + Heroicons
- **Date Handling**: date-fns

## 📋 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── HabitCard.vue   # Individual habit display
│   ├── HabitForm.vue   # Create/edit habit modal
│   ├── CalendarView.vue # Calendar visualization
│   ├── StatsCard.vue   # Statistics display
│   └── NavBar.vue      # Navigation component
├── views/              # Page components
│   ├── Home.vue        # Landing page
│   ├── Dashboard.vue   # Main dashboard
│   └── HabitDetails.vue # Detailed habit view
├── stores/             # Pinia state management
│   ├── habitStore.ts   # Habit data and operations
│   └── themeStore.ts   # Theme management
├── types/              # TypeScript type definitions
└── router/             # Vue Router configuration
```

## 🎯 Key Technical Achievements

### State Management Architecture
- Implemented robust Pinia store with proper TypeScript typing
- Efficient habit completion tracking with date-based operations
- Real-time statistics calculation including streak analysis

### Component Design
- Modular, reusable components with proper prop validation
- Consistent styling system using Tailwind CSS custom classes
- Responsive design patterns for mobile and desktop

### Data Persistence
- Local storage integration for data persistence
- Proper data serialization/deserialization
- Error handling for storage operations

### Performance Optimization
- Computed properties for efficient data transformations
- Lazy loading and code splitting with Vue Router
- Optimized re-renders with proper reactive dependencies

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/dina0elsergani/habit-tracker-vue.git
cd habit-tracker-vue

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Usage

1. **Create Habits**: Click "Create Your First Habit" to add new habits
2. **Set Goals**: Choose between daily or weekly frequency with custom goals
3. **Track Progress**: Mark habits as complete and view your streaks
4. **Analyze Data**: View detailed statistics and calendar visualization
5. **Customize**: Choose colors and descriptions for each habit

## 🎨 Design Decisions

- **Color System**: Custom Tailwind color palette with primary, secondary, and accent colors
- **Dark Mode**: Full dark mode support with smooth transitions
- **Animations**: Subtle animations for better user feedback
- **Typography**: Clean, readable font hierarchy using Inter font family
- **Spacing**: Consistent spacing system using Tailwind's spacing scale

## 🔧 Development Notes

This project was built as a demonstration of modern Vue 3 development practices, focusing on:
- Type safety with TypeScript
- Component composition and reusability
- State management best practices
- Responsive design implementation
- User experience optimization

The codebase follows Vue 3 best practices and demonstrates proficiency in building production-ready applications with modern web technologies.
