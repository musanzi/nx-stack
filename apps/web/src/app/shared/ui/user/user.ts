import { AuthStore } from '@/app/domains/auth/data-access';
import { environment } from '@/environments/environment';
import { Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user',
  imports: [MatDivider, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, RouterLink],
  templateUrl: './user.html'
})
export class User {
  profileRoute = input.required<string>();
  authStore = inject(AuthStore);

  user = computed(() => this.authStore.user());

  avatarImageUrl = computed(() => {
    const user = this.user();

    return user?.avatar
      ? user.avatar.includes('https://')
        ? user.avatar
        : `${environment.apiUrl}/uploads/profiles/${user.avatar}`
      : '/images/avatar.webp';
  });

  signOut(): void {
    this.authStore.signOut();
  }
}
