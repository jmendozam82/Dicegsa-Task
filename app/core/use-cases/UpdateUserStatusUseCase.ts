import { IProfileRepository } from '../repositories/IProfileRepository';

export class UpdateUserStatusUseCase {
    constructor(private readonly profileRepository: IProfileRepository) { }

    async execute(userId: string, active: boolean, adminId: string): Promise<void> {
        if (userId === adminId) {
            throw new Error('No puedes desactivar tu propia cuenta.');
        }

        await this.profileRepository.updateUserStatus(userId, active);
    }
}
