'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '../../infrastructure/supabase/server';
import { SupabaseTaskRepository } from '../../infrastructure/repositories/SupabaseTaskRepository';
import { SupabaseProfileRepository } from '../../infrastructure/repositories/SupabaseProfileRepository';
import { ResendEmailService } from '../../infrastructure/services/ResendEmailService';
import { CreateTaskUseCase } from '../../core/use-cases/CreateTaskUseCase';
import { UploadDeliverableUseCase } from '../../core/use-cases/UploadDeliverableUseCase';
import { UpdateTaskStatusUseCase } from '../../core/use-cases/UpdateTaskStatusUseCase';
import { CreateTaskInput, TaskStatus, TaskWithDetails } from '../../core/entities/Task';

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function createTask(input: CreateTaskInput): Promise<ActionResult<{ id: string }>> {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: 'No autorizado.' };

        const profileRepo = new SupabaseProfileRepository();
        const adminProfile = await profileRepo.getProfile(user.id);
        if (!adminProfile || adminProfile.role !== 'admin') {
            return { success: false, error: 'Solo los administradores pueden crear tareas.' };
        }

        // Get assignee profile and meeting details for email
        const supabase = await createClient();
        const [assigneeResult, meetingResult] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('id', input.assigned_to).single(),
            supabase.from('meetings').select('title').eq('id', input.meeting_id).single(),
        ]);

        // Get assignee email from auth (using Admin Client to access auth schema)
        const adminClient = await createAdminClient();
        const { data: { user: assigneeUser } } = await adminClient.auth.admin.getUserById(input.assigned_to);
        const assigneeEmail = assigneeUser?.email ?? '';

        console.log(`Debug - Assignee ID: ${input.assigned_to}, Email: ${assigneeEmail}`);

        const taskRepo = new SupabaseTaskRepository();
        const emailService = new ResendEmailService();
        const useCase = new CreateTaskUseCase(taskRepo, emailService);

        const resendResult = await useCase.execute(
            input,
            user.id,
            adminProfile.full_name ?? 'Administrador',
            assigneeEmail,
            (assigneeResult.data as { full_name: string | null } | null)?.full_name ?? 'Usuario',
            (meetingResult.data as { title: string } | null)?.title ?? 'Reunión',
        );

        console.log('Resultado de Resend:', resendResult);

        revalidatePath('/seguimiento');
        return { success: true, data: { id: (resendResult as any)?.id || 'unknown' } };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Error inesperado.' };
    }
}

export async function uploadDeliverable(formData: FormData): Promise<ActionResult> {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: 'No autorizado.' };

        const taskId = formData.get('task_id') as string;
        const file = formData.get('file') as File;
        if (!taskId || !file || file.size === 0) {
            return { success: false, error: 'Datos incompletos.' };
        }

        const taskRepo = new SupabaseTaskRepository();
        const fileUrl = await taskRepo.uploadDeliverable(taskId, user.id, file);

        const useCase = new UploadDeliverableUseCase(taskRepo);
        await useCase.execute(taskId, user.id, fileUrl);

        revalidatePath('/mis-tareas');
        revalidatePath('/seguimiento');
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Error al subir el archivo.' };
    }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<ActionResult> {
    try {
        const user = await getAuthUser();
        if (!user) return { success: false, error: 'No autorizado.' };

        const taskRepo = new SupabaseTaskRepository();
        const useCase = new UpdateTaskStatusUseCase(taskRepo);
        await useCase.execute(taskId, status, user.id);

        revalidatePath('/mis-tareas');
        revalidatePath('/seguimiento');
        return { success: true };
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Error al actualizar.' };
    }
}

export async function getMyTasks(): Promise<TaskWithDetails[]> {
    const user = await getAuthUser();
    if (!user) return [];
    const repo = new SupabaseTaskRepository();
    return repo.getTasksByUser(user.id);
}

export async function getAdminTasks(): Promise<TaskWithDetails[]> {
    const user = await getAuthUser();
    if (!user) return [];
    const repo = new SupabaseTaskRepository();
    return repo.getTasksByMeetingsCreatedBy(user.id);
}
