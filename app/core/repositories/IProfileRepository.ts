import { Profile, UpdateProfileInput } from '../entities/Profile';

export interface IProfileRepository {
    getProfile(userId: string): Promise<Profile | null>;
    updateProfile(userId: string, data: UpdateProfileInput): Promise<Profile>;
    getAllProfiles(): Promise<Profile[]>;
    updateUserStatus(userId: string, active: boolean): Promise<void>;
}
