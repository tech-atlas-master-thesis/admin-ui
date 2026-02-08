import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface ApiOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body' | 'response' | 'events';
  params?: HttpParams | Record<string, string | number | boolean | (string | number | boolean)[]>;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  credentials?: RequestCredentials;
  keepalive?: boolean;
  priority?: RequestPriority;
  cache?: RequestCache;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  integrity?: string;
  referrerPolicy?: ReferrerPolicy;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
  timeout?: number;
}

export abstract class Api {
  protected abstract readonly httpClient: HttpClient;
  protected abstract readonly baseUrl: string;

  protected get<T>(url: string, options?: ApiOptions) {
    return this.httpClient.get<T>(this.baseUrl + url, options as object);
  }

  protected post<T>(url: string, data: unknown, options?: ApiOptions) {
    return this.httpClient.post<T>(this.baseUrl + url, data, options as object);
  }

  protected put<T>(url: string, data: unknown, options?: ApiOptions) {
    return this.httpClient.put<T>(this.baseUrl + url, data, options as object);
  }

  protected delete<T>(url: string, options?: ApiOptions) {
    return this.httpClient.delete<T>(this.baseUrl + url, options as object);
  }
}
