import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessageOptions } from 'primeng/api';
import { I18nService } from '@shared/i18n/i18n-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly httpErrorsSubject = new BehaviorSubject<ToastMessageOptions[]>([]);
  private readonly i18nService = inject(I18nService);

  get httpErrors() {
    return this.httpErrorsSubject.asObservable();
  }

  addError(error: HttpErrorResponse) {
    console.log('add error', error, this.httpErrorsSubject.value);
    this.httpErrorsSubject.next([...this.httpErrorsSubject.getValue(), this.getErrorMessage(error)]);
  }

  clearError() {
    this.httpErrorsSubject.next([]);
  }

  private getErrorMessage(httpErrorResponse: HttpErrorResponse): ToastMessageOptions {
    const { status, message } = httpErrorResponse ?? {};
    if (message && status) {
      return {
        severity: 'error',
        summary: status.toString(),
        detail: message,
        life: 10000,
      };
    } else {
      return this.getDefaultErrorMessage();
    }
  }

  private getDefaultErrorMessage(): ToastMessageOptions {
    return {
      severity: 'error',
      summary: this.i18nService.instant('app.error.title'),
      detail: this.i18nService.instant('app.error.unknown'),
      life: 10000,
    };
  }
}
