import type { IUserResponse } from '@nx-stack/api-contracts';

export interface IAuthState {
  user: IUserResponse | null;
}
