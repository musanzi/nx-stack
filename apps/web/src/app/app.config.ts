import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, TitleStrategy, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideIcons } from '@/app/core/icons/provider';
import { provideTheming } from '@/app/core/theming';
import { routes } from './app.routes';
import { httpInterceptor } from './core/interceptors';
import { PageTitleStrategy } from './core/strategies';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthStore } from './domains/auth/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideClientHydration(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const authStore = inject(AuthStore);

      return isPlatformBrowser(platformId) ? authStore.initialize() : undefined;
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    provideNativeDateAdapter(),
    provideIcons(),
    provideTheming({
      primary: '#006da4',
      error: '#dc2626'
    })
  ]
};
