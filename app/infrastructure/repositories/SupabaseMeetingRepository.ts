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
}
