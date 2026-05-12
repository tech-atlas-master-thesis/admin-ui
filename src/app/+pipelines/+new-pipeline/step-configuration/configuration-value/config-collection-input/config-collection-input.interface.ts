import { z } from 'zod';

const ConfigIdCollectionObject = z.object({
  configurationId: z.optional(z.string()),
  configurationName: z.optional(z.string()),
  versionId: z.optional(z.string()),
  versionName: z.optional(z.string()),
});
export type ConfigIdCollection = z.infer<typeof ConfigIdCollectionObject>;

const ConfigCollectionObject = z.object({
  configuration: z.nullable(
    z.object({
      id: z.string(),
      name: z.optional(z.string()),
      type: z.optional(z.string()),
    }),
  ),
  version: z.nullable(z.object({ id: z.string(), name: z.optional(z.string()), version: z.optional(z.number()) })),
});

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
          ? { id: result.data.versionId, name: result.data.versionName?.toString() ?? undefined }
          : null,
      };
    }
    return { configuration: null, version: null };
  },
  encode: (obj) => {
    const result = ConfigCollectionObject.safeParse(obj);
    return {
      configurationId: result.data?.configuration?.id,
      configurationName: result.data?.configuration?.name ?? result.data?.configuration?.type,
      versionId: result.data?.version?.id,
      versionName: result.data?.version?.name ?? result.data?.version?.version?.toString(),
    };
  },
});
