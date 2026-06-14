export const DATA_SET_OBJECT_TYPES = [
  'projects',
  'organizations',
  'grants',
  'programmes',
  'technologies',
  'fields',
] as const;
export type DataSetObjectType = (typeof DATA_SET_OBJECT_TYPES)[number];
