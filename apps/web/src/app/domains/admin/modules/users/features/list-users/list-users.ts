import { DatePipe } from '@angular/common';
import { Component, computed, debounced, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import type { components } from '@starter/api-contracts';
import { filter } from 'rxjs';

import { UsersStore } from '../../data-access/users.store';
import { IUsersQueryParams, IRemoveUserDialogData, IUserDialogData, IUserDialogResult } from '../../interfaces';
import { RemoveUserDialog } from '../../ui/remove-user-dialog/remove-user-dialog';
import { UserFormDialog } from '../../ui/user-form-dialog/user-form-dialog';

@Component({
  imports: [DatePipe, FormsModule, MatButtonModule, MatDialogModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './list-users.html',
  providers: [UsersStore]
})
export default class Users implements OnInit {
  protected readonly store = inject(UsersStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly page = signal<number>(1);
  protected readonly q = signal<string>('');
  protected readonly debouncedQuery = debounced(this.q, 300);
  protected readonly displayedColumns = ['name', 'email', 'roles', 'createdAt', 'actions'];

  private readonly queryParams = computed<IUsersQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value()
  }));

  private readonly loadUsersEffect = effect(() => this.store.loadUsers(this.queryParams()));

  ngOnInit(): void {
    this.store.loadRoles();
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<UserFormDialog, IUserDialogData, IUserDialogResult>(UserFormDialog, {
        data: { roles: this.store.roles() },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IUserDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createUser(payload));
  }

  protected openUpdateDialog(user: components['schemas']['UserResponse']): void {
    this.dialog
      .open<UserFormDialog, IUserDialogData, IUserDialogResult>(UserFormDialog, {
        data: { roles: this.store.roles(), user },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IUserDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateUser({ id: user.id, payload }));
  }

  protected openRemoveDialog(user: components['schemas']['UserResponse']): void {
    this.dialog
      .open<RemoveUserDialog, IRemoveUserDialogData, boolean>(RemoveUserDialog, {
        data: { user },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeUser({ id: user.id }));
  }
}
