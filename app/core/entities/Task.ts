export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    id: string;
    meeting_id: string;
    assigned_to: string | null;
    created_by: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    deliverable_url: string | null;
    due_date: string | null;
    created_at: string;
}

export interface TaskWithDetails extends Task {
    assigned_user_name?: string | null;
    meeting_title?: string;
}

export interface CreateTaskInput {
    meeting_id: string;
    assigned_to: string;
    title: string;
    description?: string;
    due_date?: string;
}
