'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../infrastructure/supabase/server';

type ActionResult = { success: boolean; error?: string };

export async function signIn(email: string, password: string): Promise<ActionResult> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    redirect('/');
}

export async function signUp(
    email: string,
    password: string,
    fullName: string
): Promise<ActionResult> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    redirect('/');
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
