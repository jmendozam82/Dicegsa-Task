import { IMeetingRepository } from '../../core/repositories/IMeetingRepository';
import { Meeting, CreateMeetingInput } from '../../core/entities/Meeting';
import { createClient } from '../supabase/server';

export class SupabaseMeetingRepository implements IMeetingRepository {
    async createMeeting(
        input: CreateMeetingInput,
        adminId: string
    ): Promise<Meeting> {
        const supabase = await createClient();

        // 1. Insert the meeting
        const { data: meeting, error: meetingError } = await supabase
            .from('meetings')
            .insert({
                title: input.title,
                description: input.description ?? null,
                created_by: adminId,
            })
            .select()
            .single();

        if (meetingError || !meeting) {
            throw new Error(meetingError?.message ?? 'Error al crear la reunión.');
        }

        // 2. Insert participants if any
        if (input.participant_ids.length > 0) {
            const participants = input.participant_ids.map((userId) => ({
                meeting_id: meeting.id,
                user_id: userId,
            }));

            const { error: participantError } = await supabase
                .from('meeting_participants')
                .insert(participants);

            if (participantError) {
                throw new Error(participantError.message ?? 'Error al insertar participantes.');
            }
        }

        return meeting as Meeting;
    }

    async getMeetingsForUser(userId: string): Promise<Meeting[]> {
        const supabase = await createClient();

        // 1. Fetch meetings where the user is a participant
        // We use !inner and explicit filter on participant's user_id 
        // to bypass 'Blind Read' limitations for joining participant details.
        const { data: joinedData } = await supabase
            .from('meetings')
            .select(`
                *,
                meeting_participants!inner(
                    user_id,
                    profiles:user_id(full_name)
                )
            `)
            .eq('meeting_participants.user_id', userId);

        // 2. Fetch meetings created by the user
        const { data: createdData } = await supabase
            .from('meetings')
            .select(`
                *,
                meeting_participants(
                    user_id,
                    profiles:user_id(full_name)
                )
            `)
            .eq('created_by', userId);

        // 3. Combine and de-duplicate
        const all = [...(joinedData || []), ...(createdData || [])];
        const unique = Array.from(new Map(all.map(m => [m.id, m])).values());

        return unique.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    async getMeetingById(id: string): Promise<Meeting | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return data as Meeting;
    }

    async getMeetingParticipants(meetingId: string): Promise<{ id: string; full_name: string | null }[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('meeting_participants')
            .select(`
                user_id,
                profiles:user_id(full_name)
            `)
            .eq('meeting_id', meetingId);

        if (error || !data) return [];

        return data.map((p: any) => ({
            id: p.user_id,
            full_name: p.profiles?.full_name || 'Usuario desconocido'
        }));
    }
}
