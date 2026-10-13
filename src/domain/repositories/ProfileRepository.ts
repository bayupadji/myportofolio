import { Profile } from "../entities/Profile";

export interface ProfileRepository {
  getProfile(): Promise<Profile>;
  updateAvailability(statusEn: string, statusId: string, isFreelance: boolean): Promise<void>;
  updateProfile(profile: Profile): Promise<void>;
}
