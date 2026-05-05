export interface DataSetObjectsColumn {
  labelKey: string;
  field: string;
  tooltipField?: string;
  sort?: string;
  displayFn?: (field: unknown) => string;
}
