import type { components } from '@starter/api-contracts';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@/environments/environment';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, pipe, tap } from 'rxjs';
import { getApiErrorMessage } from '@/app/core/api';
import { AuthStore } from '@/app/domains/auth/data-access';

export const SignInStore = signalStore(
  withState({ isLoading: false, error: '' }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router),
    _authStore: inject(AuthStore),
    googleSignInUrl: `${environment.apiUrl}/auth/signin/google`
  })),
  withMethods(({ _http, _authStore, _router, ...store }) => ({
    signIn: rxMethod<components['schemas']['SignInDto']>(
      pipe(
        concatMap((payload) => {
          patchState(store, { isLoading: true, error: '' });
          return _http.post<components['schemas']['UserResponse']>('/auth/signin', payload).pipe(
            tap((user) => {
              _authStore.setUser(user);
              return _authStore.isAdmin() ? _router.navigate(['/admin']) : _router.navigate(['/user']);
            }),
            catchError((error: unknown) => {
              patchState(store, { error: getApiErrorMessage(error, 'Incorrect email address or password.') });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          );
        })
      )
    ),
    clearError(): void {
      patchState(store, { error: '' });
    }
  }))
);
