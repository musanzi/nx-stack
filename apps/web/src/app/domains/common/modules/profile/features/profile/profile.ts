import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import type { components } from '@web/api-contracts';

import { AuthStore } from '@web/domains/auth/shared/data-access';
import { Message } from '@web/shared/ui';
import { environment } from '@/environments/environment';

import { ProfileStore } from '@web/domains/common/modules/profile/shared/data-access';
import { IProfileFormModel, IUpdatePasswordFormModel } from '@web/domains/common/modules/profile/shared/interfaces';

@Component({
  imports: [Message, FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './profile.html',
  providers: [ProfileStore]
})
export default class Profile {
  protected readonly authStore = inject(AuthStore);
  protected readonly store = inject(ProfileStore);

  private readonly user = this.authStore.user();

  protected readonly profileImageUrl = computed(() => {
    const user = this.authStore.user();
    return user?.avatar ? `${environment.apiUrl}/uploads/profiles/${user.avatar}` : '/images/avatar.webp';
  });

  protected readonly profileModel = signal<IProfileFormModel>({
    name: this.user?.name ?? '',
    email: this.user?.email ?? ''
  });

  protected readonly profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Le nom est requis.' });
    required(schemaPath.email, { message: "L'adresse e-mail est requise." });
    email(schemaPath.email, { message: "L'adresse e-mail est invalide." });
  });

  protected readonly passwordModel = signal<IUpdatePasswordFormModel>({
    password: '',
    confirmPassword: ''
  });

  protected readonly passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, { message: 'Le mot de passe est requis.' });
    minLength(schemaPath.password, 8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    required(schemaPath.confirmPassword, { message: 'La confirmation est requise.' });
    validate(schemaPath.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(schemaPath.password)
        ? { kind: 'password-match', message: 'Les mots de passe ne correspondent pas.' }
        : undefined
    );
  });

  protected hidePassword = true;
  protected hidePasswordConfirmation = true;

  constructor() {
    effect(() => {
      if (this.store.passwordUpdated()) {
        untracked(() => {
          this.passwordModel.set({ password: '', confirmPassword: '' });
          this.passwordForm().reset();
        });
      }
    });
  }

  protected onUpdateProfile(): void {
    submit(this.profileForm, async (formState) => {
      const value = formState().value();
      const payload: components['schemas']['UpdateUserDto'] = {
        name: value.name.trim(),
        email: value.email.trim()
      };

      this.store.updateProfile(payload);
    });
  }

  protected onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.store.updateProfileImage(image);
    input.value = '';
  }

  protected onUpdatePassword(): void {
    submit(this.passwordForm, async (formState) => {
      this.store.updatePassword({ password: formState().value().password });
    });
  }
}
