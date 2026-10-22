import type { ICreateUserDto, IRoleResponse, IUpdateUserDto, IUserResponse } from '@nx-stack/api-contracts';

export interface IUpdateUserCommand {
  id: IUserResponse['id'];
  payload: IUpdateUserDto;
}

export type IRemoveUserCommand = Pick<IUserResponse, 'id'>;

export type IUserFormModel = Required<Pick<ICreateUserDto, 'email' | 'name' | 'roles'>>;

export interface IUserDialogData {
  roles: IRoleResponse[];
  user?: IUserResponse;
}

export interface IUserDialogResult {
  payload: ICreateUserDto;
}

export interface IRemoveUserDialogData {
  user: IUserResponse;
}

export interface IUsersState {
  isSaving: boolean;
  isExporting: boolean;
  removingUserId: string;
  error: string;
}
