import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileDownload {
  downloadFile$(file$: Observable<HttpEvent<Blob> | undefined>) {
    return file$.pipe(
      tap((event) => {
        if (!event) {
          return;
        }
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            // TODO: create better progress display
            return;
          case HttpEventType.Response: {
            if (!event.body) {
              return;
            }
            const element = document.createElement('a');
            document.body.appendChild(element);
            element.style.display = 'none';
            const url = globalThis.URL.createObjectURL(event.body);
            const contentDisposition = event.headers.get('Content-Disposition');
            element.href = url;
            element.download = contentDisposition?.replace('inline; filename=', '') ?? 'result.csv';
            element.click();
            globalThis.URL.revokeObjectURL(url);
            element.remove();
            return;
          }
        }
      }),
    );
  }
}
