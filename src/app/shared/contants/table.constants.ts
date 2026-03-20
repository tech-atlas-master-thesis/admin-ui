export class TableConstants {
  public static readonly INITIAL_OFFSET = 0;
  public static readonly INITIAL_LIMIT = 10;
  public static readonly INITIAL_STATE = {
    first: TableConstants.INITIAL_OFFSET,
    rows: TableConstants.INITIAL_LIMIT,
  };
  public static readonly SIZE_OPTIONS = [5, 10, 20, 50];
}
