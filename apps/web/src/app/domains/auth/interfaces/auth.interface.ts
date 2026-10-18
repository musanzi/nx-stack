import type { components } from '@starter/api-contracts';
export interface IAuthState {
  user: components['schemas']['UserResponse'] | null;
}
