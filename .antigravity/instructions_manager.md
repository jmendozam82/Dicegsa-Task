# Project: ZenTask - Clean Architecture Task Manager

## 1. System Overview
High-performance, minimalist Task Manager (Apple-style) using Next.js 14+, Supabase, and Clean Architecture.

## 2. Core Entities & Relationships
- **Profile**: System users. Roles: `admin` (managers) or `user` (executors).
- **Meeting**: Workspace container created by an Admin. Acts as the primary data boundary.
- **Task**: Units of work linked to a Meeting. Can be assigned to 1 User.
- **Deliverables**: Files (PDF, images, etc.) stored in Supabase Storage (`task-deliverables` bucket).

## 3. Critical Workflows & Business Logic

### A. Meeting-Centric Assignment
- **Logic**: Admins create a Meeting -> Invite Users (Participants) -> Assign Tasks.
- **Inbox**: Users see a unified view of tasks grouped by their parent Meeting.
- **Oversight**: Admins monitor progress (todo/in_progress/done) ONLY for meetings they created.

### B. User Management & Deactivation (Soft Delete)
- **Constraint**: Users are never deleted from `auth.users` to maintain historical integrity.
- **Action**: Update `profiles.active` to `false`.
- **Impact**: 
    1. Revoke active sessions immediately.
    2. Exclude from "New Participant" selection lists.
- **Security**: Restricted to users with `role: 'admin'`.

### C. Automatic Notifications (Resend)
- **Trigger**: Task creation or assignment change via Server Action or Webhook.
- **Template**: Minimalist Apple-style email (White bg, SF Pro font, Blue button #007AFF).
- **Content**: "Admin [Name] has assigned you a task: [Task Title] in the meeting [Meeting Title]."

### D. Deliverable Management (Supabase Storage)
- **Path**: `tasks/{task_id}/{file_name}`.
- **RLS (Security)**: 
    - **Users**: Upload/Delete their own deliverables.
    - **Admins**: View/Download all deliverables within meetings they created.

## 4. Technical Constraints
- **Architecture**: Domain-Driven Design (DDD) / Clean Architecture.
- **Security**: Row Level Security (RLS) is mandatory for all tables.
- **Language**: Backend/Logic in **English**; UI Labels/Content in **Spanish**.

## 5. UI/UX Standards (Apple Style)
- **Aesthetics**: Glassmorphism (`backdrop-blur`), SF Pro font, Rounded-2xl (16px+).
- **Interactions**: 
    - Spring animations (`framer-motion`).
    - Hover-only action buttons (to keep the interface clean).
    - Drag-and-drop area with subtle glass borders for file uploads.
    - Thin Apple-style progress lines for uploads.
