import { PaginatorState } from '@openng/optimus-ui/paginator';

export interface PaginatedListDto<T> {
  items: T[];
  page: PaginatorState;
}
