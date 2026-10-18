import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import type { components } from '@starter/api-contracts';

import { getApiErrorMessage } from '@/app/core/api';

@Component({
  templateUrl: './stats.html',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatIconModule]
})
export default class Stats {
  protected readonly statsResource = httpResource<components['schemas']['StatItem'][]>(() => '/stats');
  protected readonly errorMessage = computed(() =>
    getApiErrorMessage(this.statsResource.error(), 'Please try again in a few moments.')
  );
}
