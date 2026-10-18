import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { PageLoader } from '@/app/shared/ui/page-loader/page-loader';
import { Sidebar } from '@/app/shared/ui/sidebar/sidebar';
import { NAVIGATION } from './data/navigation';

@Component({
  selector: 'admin-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    Sidebar,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    PageLoader
  ],
  template: `
    @defer (on immediate) {
      <mat-sidenav-container>
        <mat-sidenav
          class="w-70"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!isMobile()"
          [disableClose]="!isMobile()"
          fixedInViewport
          #sidenav="matSidenav">
          <sidebar [navigation]="navigation" profileRoute="/admin/profile" />
        </mat-sidenav>

        <mat-sidenav-content class="flex flex-col lg:h-dvh lg:overflow-hidden">
          <!-- Toolbar -->
          <div class="flex items-center border-b px-4 py-2.5">
            <button matIconButton (click)="sidenav.toggle()">
              <mat-icon svgIcon="panel-left" />
            </button>

            <!-- Separator -->
            <div class="mx-3 h-5 border-l"></div>

            <!-- Spacer -->
            <div class="flex-auto"></div>
          </div>

          <!-- Content -->
          <div class="flex flex-col lg:min-h-0 lg:flex-auto lg:overflow-auto">
            <router-outlet />
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    } @placeholder {
      <app-page-loader />
    } @loading {
      <app-page-loader />
    }
  `
})
export class AdminLayout {
  private media = inject(Media);

  protected readonly navigation = NAVIGATION;
  protected isMobile = computed(() => this.media.match(`(max-width: 1023px)`)());
}
