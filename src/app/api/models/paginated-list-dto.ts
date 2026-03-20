import { PaginatorState } from 'primeng/paginator';

export interface PaginatedListDto<T> {
  items: T[];
  page: PaginatorState;
}
