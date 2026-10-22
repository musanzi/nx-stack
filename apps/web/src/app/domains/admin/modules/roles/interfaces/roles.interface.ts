import type { ICreateRoleDto, IRoleResponse, IUpdateRoleDto } from '@nx-stack/api-contracts';

export interface IUpdateRoleCommand {
  id: IRoleResponse['id'];
  payload: IUpdateRoleDto;
}

export type IRemoveRoleCommand = Pick<IRoleResponse, 'id'>;

export interface IRoleDialogData {
  role?: IRoleResponse;
}

export interface IRoleDialogResult {
  payload: ICreateRoleDto;
}

export interface IRemoveRoleDialogData {
  role: IRoleResponse;
}

export interface IRolesState {
  isSaving: boolean;
  removingRoleId: string;
  error: string;
}
