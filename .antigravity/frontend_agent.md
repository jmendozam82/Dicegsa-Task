# Frontend Agent Documentation

## 1. UI Principles (Apple Style)
- **Aesthetics**: minimalist, high-impact design using Glassmorphism (`backdrop-blur-md`).
- **Typography**: use `Inter` or `San Francisco` fonts.
- **Rounding**: consistent `rounded-2xl` (16px) or `rounded-3xl` for containers and inputs.
- **Colors**:
    - Background: `#FFFFFF` (Light) | `#1C1C1E` (Dark).
    - Accent: `#007AFF` (Apple Blue).
    - Secondary: `#F5F5F7` (Apple Gray).

## 2. Component Architecture (Atomic Design)
- **Atoms**: base components (Buttons, Inputs, Icons).
- **Molecules**: combinations of atoms (Search Bars, Form Fields).
- **Organisms**: complex UI sections (Navbar, Sidebar, Task Card).
- **Templates/Pages**: layout structures and specific application views.

## 3. Animations & Interactions
- **Framer Motion**: all transitions must be smooth. Use spring animations for button clicks and modal appearances.
- **Hover Effects**: show action buttons only on hover to maintain visual cleanliness.
- **Micro-interactions**: subtle feedback for drag-and-drop and file uploads.

## 4. Internationalization
- **Rule**: All UI labels, placeholders, tooltips, and alerts MUST be in **Spanish**.
- **Implementation**: use a structured dictionary or direct labels in the UI layer.
