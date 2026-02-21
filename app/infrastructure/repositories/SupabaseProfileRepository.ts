import { IProfileRepository } from '../../core/repositories/IProfileRepository';
import { Profile, UpdateProfileInput } from '../../core/entities/Profile';
import { createClient } from '../supabase/server';

export class SupabaseProfileRepository implements IProfileRepository {
    async getProfile(userId: string): Promise<Profile | null> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) return null;
        return data as Profile;
    }

    async updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
        const supabase = await createClient();

        const updates: Partial<Profile> = {
            updated_at: new Date().toISOString(),
        };

        if (input.full_name !== undefined) updates.full_name = input.full_name;
        if (input.avatar_url !== undefined) updates.avatar_url = input.avatar_url;

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error || !data) {
            throw new Error(error?.message ?? 'Error al actualizar el perfil.');
        }

        return data as Profile;
    }

    async uploadAvatar(userId: string, file: File): Promise<string> {
        const supabase = await createClient();
        const filePath = `${userId}/${Date.now()}_${file.name}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
    }

    async getAllProfiles(): Promise<Profile[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw new Error(error.message);
        return (data ?? []) as Profile[];
    }

    async updateUserStatus(userId: string, active: boolean): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from('profiles')
            .update({ active, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) throw new Error(error.message);
    }
}
