import { Profile } from "@/domain/entities/Profile";
import { ProfileRepository } from "@/domain/repositories/ProfileRepository";

export class GetProfile {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(): Promise<Profile> {
    return this.profileRepository.getProfile();
  }
}

export class UpdateAvailability {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(statusEn: string, statusId: string, isFreelance: boolean): Promise<void> {
    return this.profileRepository.updateAvailability(statusEn, statusId, isFreelance);
  }
}
