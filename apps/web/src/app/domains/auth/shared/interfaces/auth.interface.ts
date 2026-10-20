import type { components } from '@web/api-contracts';

export interface IAuthState {
  user: components['schemas']['UserResponse'] | null;
}
