import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { IUserSummary } from '@web/shared/interfaces';
import { environment } from '@/environments/environment';

@Component({
  selector: 'user',
  imports: [MatDivider, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, RouterLink],
  templateUrl: './user.html'
})
export class User {
  readonly profileRoute = input.required<string>();
  readonly user = input.required<IUserSummary | null>();
  readonly signedOut = output<void>();

  protected readonly avatarImageUrl = computed(() => {
    const user = this.user();

    return user?.avatar
      ? user.avatar.includes('https://')
        ? user.avatar
        : `${environment.apiUrl}/uploads/profiles/${user.avatar}`
      : '/images/avatar.webp';
  });
}
