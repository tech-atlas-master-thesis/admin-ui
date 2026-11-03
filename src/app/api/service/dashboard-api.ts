import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-base-url.token';
import { DashboardDto } from '@api/models/dashboard/dashboard-dto';

export class DashboardApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  getDashboard() {
    return this.get<DashboardDto>('/dashboard');
  }
}
