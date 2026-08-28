import { z } from 'zod';

export const ConfigurationRegexMapElementObject = z.object({
  name: z.string(),
  description: z.string(),
  mapTo: z.string(),
  keywords: z.array(z.string()),
  limitToDataSource: z.array(z.string()),
});
export type ConfigurationRegexMapElement = z.infer<typeof ConfigurationRegexMapElementObject>;

export const ConfigurationRegexMapObject = z.array(ConfigurationRegexMapElementObject);
export type ConfigurationRegexMap = z.infer<typeof ConfigurationRegexMapObject>;
export const ConfigurationRegexMapCodec = z.codec(z.array(z.looseObject({})), ConfigurationRegexMapObject, {
  encode: (regexMap) => regexMap,
  decode: (regexMap) => {
    console.log(regexMap);
    const result = ConfigurationRegexMapObject.safeParse(regexMap);
    if (result.success) {
      return result.data;
    }
    if (typeof regexMap === 'object' && Array.isArray(regexMap)) {
      return regexMap
        .map((element) => {
          const elementResult = ConfigurationRegexMapElementObject.safeParse(element);
          if (elementResult.success) {
            return elementResult.data;
          }
          return undefined;
        })
        .filter((element) => element !== undefined);
    }
    return [];
  },
});
