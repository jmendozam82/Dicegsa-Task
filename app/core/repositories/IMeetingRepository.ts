import { Meeting, CreateMeetingInput } from '../entities/Meeting';

export interface IMeetingRepository {
    createMeeting(
        input: CreateMeetingInput,
        adminId: string
    ): Promise<Meeting>;
}
