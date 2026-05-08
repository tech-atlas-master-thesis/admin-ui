import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import environment from '../../../environment/environment';

export class ScraperApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = environment.baseUrl + environment.scraperBaseUrl;
}
