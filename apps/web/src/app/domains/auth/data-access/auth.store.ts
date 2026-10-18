import type { components } from '@starter/api-contracts';
import { signalStore, withState, withMethods, patchState, withProps, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, exhaustMap, map } from 'rxjs';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { IAuthState } from '../interfaces';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<IAuthState>({ user: null }),
  withProps(() => ({
    _http: inject(HttpClient),
    _router: inject(Router)
  })),
  withComputed(({ user }) => ({
    isAdmin: computed(() => {
      return user()?.roles?.some((r) => r === 'admin');
    }),
    isUser: computed(() => {
      return user()?.roles?.some((r) => r === 'user');
    })
  })),
  withMethods(({ _http, _router, ...store }) => ({
    initialize: () => {
      return _http.get<components['schemas']['UserResponse']>('/auth/me').pipe(
        map((user) => {
          patchState(store, { user });
          return user;
        }),
        catchError(() => {
          patchState(store, { user: null });
          return of(null);
        })
      );
    },
    signOut: rxMethod<void>(
      pipe(
        exhaustMap(() =>
          _http.post<null>('/auth/signout', {}).pipe(
            tap(() => {
              _router.navigate(['/']);
              patchState(store, { user: null });
            }),
            catchError(() => {
              return of(null);
            })
          )
        )
      )
    ),
    setUser: (user: components['schemas']['UserResponse'] | null) => {
      patchState(store, { user });
    }
  }))
);
