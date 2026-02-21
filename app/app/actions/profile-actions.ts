'use server';

import { createClient } from '../../infrastructure/supabase/server';
import { SupabaseProfileRepository } from '../../infrastructure/repositories/SupabaseProfileRepository';
import { UpdateProfileUseCase } from '../../core/use-cases/UpdateProfileUseCase';
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
