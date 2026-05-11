import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

@Injectable({
  providedIn: 'root',
})
export class LazyInput<TData, TDataKey extends keyof TData> {
  readonly PLACEHOLDER_ITEM: SelectItem = Object.freeze({
    label: '',
    value: {},
    icon: 'pi pi-spin pi-spinner',
  });
  public static readonly BOUNDED_SEARCH_DEFAULT_FETCH_SIZE = 100;

  updateOptions(
    options: SelectItem<TData>[],
    newItems: SelectItem<TData>[],
    dataKey: TDataKey,
    page?: PaginatorState,
    totalCount?: number,
    selectedItem?: SelectItem<TData> | SelectItem<TData>[],
  ) {
    if (totalCount !== undefined && totalCount !== options.length) {
      options = this.padOptions(options, totalCount);
    }
    return this.replaceWithObjects(options, newItems, dataKey, page, selectedItem);
  }

  getDefaultArray(length: number) {
    return new Array(length).fill(this.PLACEHOLDER_ITEM);
  }

  replaceWithObjects(
    options: SelectItem<TData>[],
    items: SelectItem<TData>[],
    dataKey: TDataKey,
    page?: PaginatorState,
    selectedItem?: SelectItem<TData> | SelectItem<TData>[],
  ) {
    const newOptions = [...options];
    newOptions.splice(page?.first ?? 0, items.length, ...items);
    if (Array.isArray(selectedItem)) {
      selectedItem.forEach((selItem) => {
        if (selItem && !newOptions.some((item) => this.matchItem(item, selItem, dataKey))) {
          newOptions.push({ ...selItem });
        }
      });
    } else if (selectedItem && !newOptions.some((item) => this.matchItem(item, selectedItem, dataKey))) {
      newOptions.push({ ...selectedItem });
    }

    return newOptions;
  }

  private padOptions(options: SelectItem<TData>[], totalCount?: number) {
    if (totalCount === undefined) {
      return options;
    }
    if (totalCount > options.length) {
      return options.concat(this.getDefaultArray(totalCount - options.length));
    }
    if (totalCount < options.length) {
      return options.slice(0, totalCount);
    }
    return options;
  }

  private matchItem(a: SelectItem<TData>, b: SelectItem<TData>, dataKey: TDataKey): boolean {
    return a.value[dataKey] === b.value[dataKey];
  }
}
