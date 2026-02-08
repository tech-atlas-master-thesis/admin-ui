import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ActivatedRouteSnapshot, Data, Params, Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { I18nService } from '../shared/i18n/i18n-service';
import { MenuItem } from 'primeng/api';

interface BreadcrumbElement {
  routeUrls?: string[];
  queryParams?: Params;
  routeParams?: Params;
  data: Data;
  breadcrumbKey?: string;
  breadcrumbText?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [Breadcrumb],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly i18nService = inject(I18nService);
  private readonly breadcrumbsSubject = new BehaviorSubject<BreadcrumbElement[]>([]);

  private urlParents: string[] = [];

  breadcrumbData = toSignal(this.breadcrumbsSubject);

  breadcrumbs = computed(() => {
    this.i18nService.currentLanguage();
    const breadcrumbs = this.breadcrumbData();
    return breadcrumbs?.map(
      ({ breadcrumbKey, breadcrumbText, routeUrls, routeParams, data, icon }): MenuItem => ({
        label: breadcrumbKey
          ? this.i18nService.instant(breadcrumbKey, {
              ...routeParams,
              ...data,
            })
          : breadcrumbText,
        icon,
        routerLink: routeUrls,
      }),
    );
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof RoutesRecognized),
        tap((event) => {
          this.clear();
          this.extractData(event.state.root.firstChild);
        }),
      )
      .subscribe();
  }

  extractData(route: ActivatedRouteSnapshot | null) {
    if (route !== null) {
      if (route.data['breadcrumbKey']) {
        const urls = route.url.map((url) => url.path);
        const navigable = route.data['navigable'] ?? true;
        this.breadcrumbsSubject.next([
          ...this.breadcrumbsSubject.getValue(),
          {
            routeUrls: navigable ? [...this.urlParents, ...urls] : undefined,
            queryParams: navigable ? route.queryParams : undefined,
            routeParams: navigable ? route.params : undefined,
            breadcrumbKey: route.data['breadcrumbKey'],
            data: route.data,
          },
        ]);
        this.urlParents.push(...urls);
      }
      this.extractData(route.firstChild);
    }
  }

  clear() {
    this.urlParents = [];
    this.setBreadcrumbs([
      {
        routeUrls: ['/'],
        queryParams: {},
        routeParams: {},
        data: {},
        icon: 'pi pi-home',
      },
    ]);
  }

  setBreadcrumbs(breadcrumbs: BreadcrumbElement[]) {
    this.breadcrumbsSubject.next(breadcrumbs);
  }
}
