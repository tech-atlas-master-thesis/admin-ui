export const DATA_SET_OBJECT_TYPES = ['projects', 'organizations', 'grants'] as const;
export type DataSetObjectType = (typeof DATA_SET_OBJECT_TYPES)[number];
