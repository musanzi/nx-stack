import type { components } from '@nx-stack/api-contracts';

export interface IAuthState {
  user: components['schemas']['UserResponse'] | null;
}
