# Backend Agent Documentation

## 1. Supabase & Database Standards
- **Schema**: PostgreSQL with strict typing.
- **RLS (Row Level Security)**: mandatory for every table. Policies must be clearly defined in SQL migrations.
- **Entities**: follow the Clean Architecture definitions (`Profile`, `Meeting`, `Task`).

## 2. Domain & Use Cases
- **TypeScript Use Cases**: Business logic must reside in `/src/core/use-cases`.
- **Language**: All backend code (variables, functions, column names) MUST be in **English**.
- **Error Handling**: use custom error classes and structured responses: `{ success: boolean, data?: T, error?: string }`.

## 3. Infrastructure Integrations
- **Resend**: implementation of Apple-style email notifications for task assignments.
- **Storage**: use Supabase Storage for task deliverables (`task-deliverables` bucket).
- **Server Actions**: prefer Server Actions for data mutations.

## 4. Environment & Security
- **Secrets**: never expose `service_role` keys to the client.
- **Validation**: use Server-side validation for all incoming data.
