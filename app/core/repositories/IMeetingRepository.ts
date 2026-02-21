import { Meeting, CreateMeetingInput } from '../entities/Meeting';

export interface IMeetingRepository {
    createMeeting(
        input: CreateMeetingInput,
        adminId: string
    ): Promise<Meeting>;
    getMeetingsForUser(userId: string): Promise<Meeting[]>;
    getMeetingById(id: string): Promise<Meeting | null>;
    getMeetingParticipants(meetingId: string): Promise<{ id: string; full_name: string | null }[]>;
}
