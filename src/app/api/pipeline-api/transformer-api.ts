import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@api/pipeline-api/pipeline-api.token';

export class TransformerApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);
}
