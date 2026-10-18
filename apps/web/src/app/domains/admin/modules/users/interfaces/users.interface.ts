import type { components, operations } from '@nx-stack/api-contracts';

// Local list controls and store commands reference generated API models.
export interface IUsersQueryParams {
  page: number;
  q: string;
}

export interface IUpdateUserCommand {
  id: components['schemas']['UserResponse']['id'];
  payload: components['schemas']['UpdateUserDto'];
}

export type IRemoveUserCommand = Pick<components['schemas']['UserResponse'], 'id'>;

export type IUserFormModel = Required<Pick<components['schemas']['CreateUserDto'], 'email' | 'name' | 'roles'>>;

export interface IUserDialogData {
  roles: components['schemas']['RoleResponse'][];
  user?: components['schemas']['UserResponse'];
}

export interface IUserDialogResult {
  payload: components['schemas']['CreateUserDto'];
}

export interface IRemoveUserDialogData {
  user: components['schemas']['UserResponse'];
}

export interface IUsersState {
  users: operations['UsersController_findAll']['responses'][200]['content']['application/json']['data'][0];
  usersCount: operations['UsersController_findAll']['responses'][200]['content']['application/json']['data'][1];
  roles: operations['RolesController_findAll']['responses'][200]['content']['application/json']['data'][0];
  isLoading: boolean;
  isLoadingRoles: boolean;
  isSaving: boolean;
  isExporting: boolean;
  removingUserId: string;
  error: string;
}
