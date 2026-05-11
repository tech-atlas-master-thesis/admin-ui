import { computed, Directive, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { ScrollerOptions, SelectItem } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TableConstants } from '@shared/contants/table.constants';
import { Select, SelectLazyLoadEvent } from 'primeng/select';
import { LazyInput } from '@shared/lazy-input/lazy-input';
import { EqualityCheckUtil } from '@shared/util/equal';

@Directive()
export abstract class LazySelect<TValue, TArgs> implements FormValueControl<TValue | null> {
  protected abstract readonly dataKey: keyof TValue & string;
  protected abstract readonly lazyInputService: LazyInput<TValue, typeof this.dataKey>;

  select = viewChild<Select>('select');
  filter = viewChild<ElementRef<HTMLInputElement>>('filter');

  value = model<TValue | null>(null);

  readonly = input(false);
  disabled = input(false);
  enableFilter = input(false);
  showClear = input(false);
  placeholder = input('');
  virtualScrollItemSize = input(38);
  virtualScrollOptions = input<ScrollerOptions>({
    delay: 250,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.onLazyLoad.bind(this),
  });

  style = input<Record<string, unknown> | null>();
  ariaLabelledBy = input<string>();
  ariaLabel = input<string>();

  options = signal<SelectItem<TValue>[]>([]);
  total = signal(0);
  search = signal<string>('');
  page = signal<PaginatorState>(TableConstants.INITIAL_STATE);
  loading = signal<boolean>(false);

  args = computed<TArgs>(() => this.getArgs());

  updateSearch$ = new BehaviorSubject(false);

  constructor() {
    this.initFetch();
  }

  abstract fetchOptions(args: TArgs, page: PaginatorState, filter: string): Observable<PaginatedListDto<TValue>>;
  abstract convertToMenuItem(item: TValue): SelectItem<TValue>;
  abstract getArgs(): TArgs;

  onShow() {
    this.select()?.scrollInView(0);
    this.filter()?.nativeElement.focus();
  }

  clearFilter() {
    this.search.set('');
  }

  clear() {
    this.select()?.clear();
  }

  private onLazyLoad(event: SelectLazyLoadEvent): void {
    if (event.first > event.last) {
      this.select()?.scrollInView(0);
    }
    this.page.set({ first: event.first, rows: event.last - event.first });
  }

  private initFetch(): void {
    combineLatest([toObservable(this.args), toObservable(this.search), toObservable(this.value)])
      .pipe(
        tap(() => {
          this.page.set({ first: 0, rows: 10 });
        }),
        combineLatestWith(toObservable(this.page)),
        tap(([[, , value], page]) => {
          if (!page) {
            this.updateOptions(
              { items: this.lazyInputService.getDefaultArray(10), page: { totalRecords: 10 } },
              { first: 0 },
              value,
            );
          }
        }),
        filter(([, page]) => {
          return (page?.rows ?? 0) > 0;
        }),
        debounceTime(200),
        distinctUntilChanged((previous, current) => {
          const [prevInput, prevPage] = previous;
          const [prevArgs, prevSearch] = prevInput;
          const [currInput, currPage] = current;
          const [currArgs, currSearch] = currInput;

          return (
            EqualityCheckUtil.deepEqual(prevArgs, currArgs) &&
            prevSearch === currSearch &&
            EqualityCheckUtil.deepEqual(prevPage, currPage)
          );
        }),
        combineLatestWith(this.updateSearch$),
        tap(() => {
          this.loading.set(true);
        }),
        switchMap(([[[args, search, value], page]]) => {
          return this.fetchOptions(args, page, search).pipe(
            tap((data) => {
              this.updateOptions(data, page, value);
            }),
          );
        }),
        tap(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private updateOptions(data: PaginatedListDto<TValue>, page: PaginatorState | undefined, value: TValue | null): void {
    this.options.update((options) => {
      return this.lazyInputService.updateOptions(
        options,
        data.items.map((item) => this.convertToMenuItem(item)),
        this.dataKey,
        page,
        data.page.totalRecords,
        value ? this.convertToMenuItem(value) : undefined,
      );
    });
  }
}
