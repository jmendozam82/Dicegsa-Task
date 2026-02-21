export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'admin' | 'user';
    active: boolean;
    updated_at: string;
}

export interface UpdateProfileInput {
    full_name?: string;
    avatar_url?: string;
}
