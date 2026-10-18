import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { Component, inject } from '@angular/core';
import { LandingCta } from '../ui/cta/cta';
import { LandingFeatures } from '../ui/features/features';
import { LandingHero } from '../ui/hero/hero';

@Component({
  selector: 'app-landing',
  imports: [LandingHero, LandingFeatures, LandingCta],
  templateUrl: './landing.html'
})
export class Landing {
  protected readonly authStore = inject(AuthStore);

  protected signOut(): void {
    this.authStore.signOut();
  }
}
