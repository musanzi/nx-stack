import type { components, operations } from '@starter/api-contracts';

export interface IUpdateRoleCommand {
  id: components['schemas']['RoleResponse']['id'];
  payload: components['schemas']['UpdateRoleDto'];
}

export type IRemoveRoleCommand = Pick<components['schemas']['RoleResponse'], 'id'>;

export interface IRoleDialogData {
  role?: components['schemas']['RoleResponse'];
}

export interface IRoleDialogResult {
  payload: components['schemas']['CreateRoleDto'];
}

export interface IRemoveRoleDialogData {
  role: components['schemas']['RoleResponse'];
}

export interface IRolesState {
  roles: operations['RolesController_findAll']['responses'][200]['content']['application/json']['data'][0];
  isLoading: boolean;
  isSaving: boolean;
  removingRoleId: string;
  error: string;
}
