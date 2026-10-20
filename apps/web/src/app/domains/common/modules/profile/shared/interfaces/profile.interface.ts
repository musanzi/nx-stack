import type { components } from '@web/api-contracts';

export type IProfileFormModel = Pick<components['schemas']['CreateUserDto'], 'name' | 'email'>;

export type IUpdatePasswordFormModel = components['schemas']['UpdatePasswordDto'] & {
  confirmPassword: string;
};

export interface IProfileState {
  isUpdatingProfile: boolean;
  isUpdatingProfileImage: boolean;
  isUpdatingPassword: boolean;
  profileUpdated: boolean;
  profileImageUpdated: boolean;
  passwordUpdated: boolean;
  profileError: string;
  profileImageError: string;
  passwordError: string;
}
