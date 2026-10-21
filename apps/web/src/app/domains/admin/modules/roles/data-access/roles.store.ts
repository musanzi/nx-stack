import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import type { components, operations } from '@nx-stack/api-contracts';
import { catchError, concatMap, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';

import { getApiErrorMessage } from '@/app/core/api';

import {
  IRemoveRoleCommand,
  IRolesState,
  IUpdateRoleCommand
} from '@web/domains/admin/modules/roles/interfaces';

const initialState: IRolesState = {
  roles: [],
  isLoading: false,
  isSaving: false,
  removingRoleId: '',
  error: ''
};

export const RolesStore = signalStore(
  withState(initialState),
  withProps(() => ({ _http: inject(HttpClient) })),
  withMethods(({ _http, ...store }) => ({
    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: '' })),
        switchMap(() =>
          _http
            .get<operations['RolesController_findAll']['responses'][200]['content']['application/json']['data']>(
              '/roles'
            )
            .pipe(
              tap(([roles]) => patchState(store, { roles })),
              catchError((error: unknown) => {
                patchState(store, { error: getApiErrorMessage(error, 'Unable to load roles. Please try again.') });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isLoading: false }))
            )
        )
      )
    ),
    createRole: rxMethod<components['schemas']['CreateRoleDto']>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.post<components['schemas']['RoleResponse']>('/roles', payload).pipe(
            tap((role) => patchState(store, { roles: [...store.roles(), role] })),
            catchError((error: unknown) => {
              patchState(store, { error: getApiErrorMessage(error, 'Unable to create the role. Please try again.') });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    updateRole: rxMethod<IUpdateRoleCommand>(
      pipe(
        concatMap(({ id, payload }) => {
          patchState(store, { isSaving: true, error: '' });
          return _http.patch<components['schemas']['RoleResponse']>(`/roles/${id}`, payload).pipe(
            tap((updatedRole) =>
              patchState(store, {
                roles: store.roles().map((role) => (role.id === id ? updatedRole : role))
              })
            ),
            catchError((error: unknown) => {
              patchState(store, { error: getApiErrorMessage(error, 'Unable to update the role. Please try again.') });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          );
        })
      )
    ),
    removeRole: rxMethod<IRemoveRoleCommand>(
      pipe(
        concatMap(({ id }) => {
          patchState(store, { removingRoleId: id, error: '' });
          return _http.delete<null>(`/roles/${id}`).pipe(
            tap(() => patchState(store, { roles: store.roles().filter((role) => role.id !== id) })),
            catchError((error: unknown) => {
              patchState(store, { error: getApiErrorMessage(error, 'Unable to delete the role. Please try again.') });
              return EMPTY;
            }),
            finalize(() => patchState(store, { removingRoleId: '' }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
