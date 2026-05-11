import { z } from 'zod';

const ConfigIdCollectionObject = z.object({
  configurationId: z.nullable(z.string()),
  configurationName: z.nullable(z.string()),
  versionId: z.nullable(z.string()),
  versionName: z.nullable(z.string()),
});
export type ConfigIdCollection = z.infer<typeof ConfigIdCollectionObject>;

const ConfigCollectionObject = z.object({
  configuration: z.nullable(
    z.object({
      id: z.string(),
      name: z.optional(z.string()),
      type: z.string(),
      created: z.object({ at: z.optional(z.undefined()), by: z.optional(z.undefined()) }),
    }),
  ),
  version: z.nullable(z.object({ id: z.string(), name: z.optional(z.string()), version: z.optional(z.string()) })),
});
export type ConfigCollection = z.infer<typeof ConfigCollectionObject>;

export const configCollectionCodec = z.codec(ConfigIdCollectionObject, ConfigCollectionObject, {
  decode: (obj) => {
    const result = ConfigIdCollectionObject.safeParse(obj);
    if (result.success) {
      return {
        configuration: result.data.configurationId
          ? {
              id: result.data.configurationId,
              type: result.data.configurationName ?? '',
              name: result.data.configurationName ?? undefined,
              created: {},
            }
          : null,
        version: result.data.versionId
          ? { id: result.data.versionId, name: result.data.versionName ?? undefined }
          : null,
      };
    }
    return { configuration: null, version: null };
  },
  encode: (obj) => {
    const result = ConfigCollectionObject.safeParse(obj);
    return {
      configurationId: result.data?.configuration?.id ?? null,
      configurationName: result.data?.configuration?.name ?? result.data?.configuration?.type ?? null,
      versionId: result.data?.version?.id ?? null,
      versionName: result.data?.version?.name ?? result.data?.version?.version ?? null,
    };
  },
});
