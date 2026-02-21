'use server';

import { createClient } from '../../infrastructure/supabase/server';
import { SupabaseMeetingRepository } from '../../infrastructure/repositories/SupabaseMeetingRepository';
import { CreateMeetingUseCase } from '../../core/use-cases/CreateMeetingUseCase';
import { CreateMeetingInput } from '../../core/entities/Meeting';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createMeeting(
    input: CreateMeetingInput
): Promise<ActionResult<{ id: string; title: string }>> {
    try {
        const supabase = await createClient();

        // 1. Verify authenticated session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No autorizado. Debes iniciar sesión.' };
        }

        // 2. Verify admin role from profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return { success: false, error: 'No se pudo verificar el perfil del usuario.' };
        }

        if (profile.role !== 'admin') {
            return { success: false, error: 'Acceso denegado. Solo los administradores pueden crear reuniones.' };
        }

        // 3. Execute use case
        const repository = new SupabaseMeetingRepository();
        const useCase = new CreateMeetingUseCase(repository);
        const meeting = await useCase.execute(input, user.id);

        // revalidate paths as requested
        revalidatePath('/');
        revalidatePath('/admin/dashboard');

        return { success: true, data: { id: meeting.id, title: meeting.title } };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado.';
        return { success: false, error: message };
    }
}

export async function getMeetingDetail(id: string) {
    try {
        const repository = new SupabaseMeetingRepository();
        return await repository.getMeetingById(id);
    } catch (err) {
        return null;
    }
}

export async function getParticipants(meetingId: string) {
    try {
        const repository = new SupabaseMeetingRepository();
        return await repository.getMeetingParticipants(meetingId);
    } catch (err) {
        return [];
    }
}

export async function getMeetings() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const repository = new SupabaseMeetingRepository();
        return await repository.getMeetingsForUser(user.id);
    } catch (err) {
        return [];
    }
}

export async function getActiveUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('active', true);

    if (error) return [];
    return data ?? [];
}
