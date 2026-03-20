import { SortMeta } from 'primeng/api';

export type SortOrder = -1 | 1;

export interface MultiSort {
  multisortmeta: SortMeta[];
}

export class SortUtil {
  public static isMultiSort(sort: object): sort is MultiSort {
    return 'multisortmeta' in sort;
  }

  public static getSortString(_sort: SortMeta[]): string {
    return '';
  }
}
