import { IMeetingRepository } from '../repositories/IMeetingRepository';
import { Meeting, CreateMeetingInput } from '../entities/Meeting';

export class CreateMeetingUseCase {
    constructor(private readonly meetingRepository: IMeetingRepository) { }

    async execute(
        input: CreateMeetingInput,
        adminId: string
    ): Promise<Meeting> {
        if (!input.title || input.title.trim().length === 0) {
            throw new Error('El título de la reunión es obligatorio.');
        }

        return this.meetingRepository.createMeeting(input, adminId);
    }
}
