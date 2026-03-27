import { FilterMetadata } from 'primeng/api';

export interface DateTimeFilter {
  from?: Date;
  to?: Date;
}

export class FilterUtil {
  public static getFilter(filter: Record<string, FilterMetadata[] | undefined>): object {
    return Object.fromEntries(
      Object.entries(filter)
        .flatMap(([key, value]) => {
          if (value === undefined) {
            return undefined;
          }
          return value.map((operation) => {
            if (!operation.value) {
              return undefined;
            }
            return [key, operation.value];
          });
        })
        .filter((item) => item !== undefined),
    );
  }
}
