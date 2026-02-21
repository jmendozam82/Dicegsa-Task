import { IProfileRepository } from '../repositories/IProfileRepository';
import { Profile, UpdateProfileInput } from '../entities/Profile';

export class UpdateProfileUseCase {
    constructor(private readonly profileRepository: IProfileRepository) { }

    async execute(userId: string, data: UpdateProfileInput): Promise<Profile> {
        if (data.full_name !== undefined && data.full_name.trim().length === 0) {
            throw new Error('El nombre no puede estar vacío.');
        }

        return this.profileRepository.updateProfile(userId, {
            ...data,
            full_name: data.full_name?.trim(),
        });
    }
}
