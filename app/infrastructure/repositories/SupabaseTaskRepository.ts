import { ITaskRepository } from '../../core/repositories/ITaskRepository';
import { Task, TaskWithDetails, CreateTaskInput, TaskStatus } from '../../core/entities/Task';
import { createClient } from '../supabase/server';

export class SupabaseTaskRepository implements ITaskRepository {
    async createTask(input: CreateTaskInput, adminId: string): Promise<Task> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                meeting_id: input.meeting_id,
                assigned_to: input.assigned_to,
                created_by: adminId,
                title: input.title,
                description: input.description ?? null,
                due_date: input.due_date ?? null,
                status: 'todo',
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Error al crear la tarea.');
        return data as Task;
    }

    async getTasksByUser(userId: string): Promise<TaskWithDetails[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('tasks')
            .select(`
        *,
        meetings!inner(title)
      `)
            .eq('assigned_to', userId)
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        return data.map((row: Record<string, unknown>) => ({
            ...row,
            meeting_title: (row.meetings as { title: string } | null)?.title,
        })) as TaskWithDetails[];
    }

    async getTasksByMeetingsCreatedBy(adminId: string): Promise<TaskWithDetails[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('tasks')
            .select(`
        *,
        meetings!inner(title, created_by),
        profiles!tasks_assigned_to_fkey(full_name)
      `)
            .eq('meetings.created_by', adminId)
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        return data.map((row: Record<string, unknown>) => ({
            ...row,
            meeting_title: (row.meetings as { title: string } | null)?.title,
            assigned_user_name: (row.profiles as { full_name: string | null } | null)?.full_name,
        })) as TaskWithDetails[];
    }

    async updateTaskStatus(taskId: string, status: TaskStatus, userId: string): Promise<Task> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Error al actualizar el estado.');
        return data as Task;
    }

    async setDeliverableUrl(taskId: string, userId: string, url: string): Promise<Task> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('tasks')
            .update({ deliverable_url: url, status: 'done' })
            .eq('id', taskId)
            .eq('assigned_to', userId)
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Error al guardar el entregable.');
        return data as Task;
    }

    async uploadDeliverable(taskId: string, userId: string, file: File): Promise<string> {
        const supabase = await createClient();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `tasks/${taskId}/${Date.now()}_${safeFileName}`;

        const { error } = await supabase.storage
            .from('task-deliverables')
            .upload(filePath, file, { upsert: true });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from('task-deliverables').getPublicUrl(filePath);
        return data.publicUrl;
    }
}
