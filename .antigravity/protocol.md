# Engineering Protocol & Coding Standards

## 1. Directory Structure (Clean Architecture)
Agents must strictly follow this folder hierarchy to ensure scalability:
- `/src/core/entities`: Pure TypeScript interfaces (No dependencies).
- `/src/core/use-cases`: Business logic interfaces and abstract rules.
- `/src/application`: Implementation of use cases and DTOs.
- `/src/infrastructure`: Supabase clients, Repositories (DB logic), and Resend API.
- `/src/ui/components`: React components (Atomic Design).
- `/src/ui/hooks`: Custom React hooks for UI state.
- `/src/ui/styles`: Tailwind configurations and global CSS.

## 2. Coding & Communication Rules
- **Language Policy**: 
    - All code (variables, functions, classes, DB columns) must be in **English**.
    - All User Interface text (labels, placeholders, alerts) must be in **Spanish**.
- **Error Handling**: Use custom Error classes. Never return `any`. All Server Actions must return: `{ success: boolean, data?: T, error?: string }`.
- **Data Fetching**: Prefer Server Components for fetching and Server Actions for mutations.
- **Typing**: Strict TypeScript is mandatory. Avoid `any` at all costs.

## 3. Database & Security Protocol (Supabase)
- **RLS Mandatory**: Every new table must have an associated Row Level Security policy in the SQL migrations.
- **Secrets**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in the client side.
- **Integrity**: Foreign Keys are mandatory between `profiles`, `meetings`, and `tasks`.
- **Migrations**: All DB changes must be documented in a `.sql` file for version control.

## 4. UI Protocol (Apple Minimalist Standard)
- **Typography**: Primary font: `Inter` or `San Francisco`. Fallback: `sans-serif`.
- **Color Palette**: 
    - Background: `#FFFFFF` | Secondary: `#F5F5F7` (Apple Gray).
    - Accent: `#007AFF` (Apple Blue) | Success: `#34C759`.
- **Effects**: Use `backdrop-blur-md` for modals, sidebars, and navigation bars.
- **Rounding**: All containers and inputs must use `rounded-2xl` (16px) or `rounded-3xl`.
- **Spacing**: Use a consistent 4px/8px grid system (Tailwind spacing units).
