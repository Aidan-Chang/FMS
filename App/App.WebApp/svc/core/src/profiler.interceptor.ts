import { HttpRequest, HttpInterceptorFn, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

declare var MiniProfiler: any;

export const profilerInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (typeof MiniProfiler !== 'undefined' && event.headers) {
          const headers = event.headers.getAll('x-miniprofiler-ids');
          if (!headers) {
            return;
          }
          headers.forEach(value => {
            const ids = JSON.parse(value) as string[];
            MiniProfiler.fetchResults(ids);
          });
        }
      }
    })
  );
}