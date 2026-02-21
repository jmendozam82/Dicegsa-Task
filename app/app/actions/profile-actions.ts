'use server';

import { createClient } from '../../infrastructure/supabase/server';
import { SupabaseProfileRepository } from '../../infrastructure/repositories/SupabaseProfileRepository';
import { UpdateProfileUseCase } from '../../core/use-cases/UpdateProfileUseCase';
import { Profile } from '../../core/entities/Profile';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

export async function updateProfile(formData: FormData): Promise<ActionResult> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'No autorizado.' };
        }

        const repository = new SupabaseProfileRepository();
        const useCase = new UpdateProfileUseCase(repository);

        // Handle avatar upload first if present
        const avatarFile = formData.get('avatar') as File | null;
        let avatarUrl: string | undefined;

        if (avatarFile && avatarFile.size > 0) {
            avatarUrl = await repository.uploadAvatar(user.id, avatarFile);
        }

        const fullName = formData.get('full_name') as string | null;

        await useCase.execute(user.id, {
            full_name: fullName ?? undefined,
            avatar_url: avatarUrl,
        });

        revalidatePath('/');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado.';
        return { success: false, error: message };
    }
}

export async function getCurrentProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const repository = new SupabaseProfileRepository();
    return repository.getProfile(user.id);
}

export async function getAllUsers(): Promise<ActionResult<Profile[]>> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'No autorizado.' };

        const repository = new SupabaseProfileRepository();
        const adminProfile = await repository.getProfile(user.id);
        if (!adminProfile || adminProfile.role !== 'admin') {
            return { success: false, error: 'Acceso denegado.' };
        }

        const profiles = await repository.getAllProfiles();
        return { success: true, data: profiles };
    } catch (err) {
        return { success: false, error: 'Error al obtener usuarios.' };
    }
}

export async function updateUserStatus(targetUserId: string, active: boolean): Promise<ActionResult> {
    try {
        const supabase = await createClient();
        const { data: { user: admin } } = await supabase.auth.getUser();
        if (!admin) return { success: false, error: 'No autorizado.' };

        const repository = new SupabaseProfileRepository();
        const adminProfile = await repository.getProfile(admin.id);
        if (!adminProfile || adminProfile.role !== 'admin') {
            return { success: false, error: 'Acceso denegado.' };
        }

        const { UpdateUserStatusUseCase } = await import('../../core/use-cases/UpdateUserStatusUseCase');
        const useCase = new UpdateUserStatusUseCase(repository);
        await useCase.execute(targetUserId, active, admin.id);

        revalidatePath('/admin/users');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar estado.';
        return { success: false, error: message };
    }
}
