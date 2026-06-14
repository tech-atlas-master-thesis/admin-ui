import { z, ZodSafeParseResult } from 'zod';

function safeDecodeWithFallback<T>(result: ZodSafeParseResult<T>, fallback: T): T {
  return result.success ? result.data : fallback;
}

export const ConfigurationTechnologyStyleObject = z.object({
  color: z.string().nullable(),
  accent: z.string().nullable(),
});
export type ConfigurationTechnologyStyle = z.infer<typeof ConfigurationTechnologyStyleObject>;
export const ConfigurationTechnologyStyleCodec = z.codec(z.looseObject({}), ConfigurationTechnologyStyleObject, {
  encode: (style) => style,
  decode: (style) => {
    const result = ConfigurationTechnologyStyleObject.safeParse(style);
    return result.success ? result.data : { color: '', accent: '' };
  },
});

export const ConfigurationTechnologyObject = z.object({
  label: z.string().nullable(),
  short: z.string().nullable(),
  style: ConfigurationTechnologyStyleObject,
  programmes: z.array(z.string()),
  searchTerms: z.array(z.string()),
});
export type ConfigurationTechnology = z.infer<typeof ConfigurationTechnologyObject>;
export const ConfigurationTechnologyCodec = z.codec(z.looseObject({}), ConfigurationTechnologyObject, {
  encode: (tech) => tech,
  decode: (tech) => {
    const result = ConfigurationTechnologyObject.safeParse(tech);
    if (result.success) {
      return result.data;
    }
    return {
      label: safeDecodeWithFallback(z.string().safeDecode(tech['label'] as string), null),
      short: safeDecodeWithFallback(z.string().safeDecode(tech['short'] as string), null),
      style: safeDecodeWithFallback(
        ConfigurationTechnologyStyleCodec.safeDecode(tech['style'] as Record<string, unknown>),
        { color: null, accent: null },
      ),
      programmes: safeDecodeWithFallback(
        z.array(z.string()).safeDecode(tech['programmes'] as string[]),
        [] as string[],
      ),
      searchTerms: safeDecodeWithFallback(
        z.array(z.string()).safeDecode(tech['searchTerms'] as string[]),
        [] as string[],
      ),
    };
  },
});

export const ConfigurationTechnologyFieldObject = z.object({
  label: z.string().nullable(),
  short: z.string().nullable(),
  style: ConfigurationTechnologyStyleObject,
  programmes: z.array(z.string()),
  technologies: z.array(ConfigurationTechnologyObject),
});
export type ConfigurationTechnologyField = z.infer<typeof ConfigurationTechnologyFieldObject>;
export const ConfigurationTechnologyFieldCodex = z.codec(z.looseObject({}), ConfigurationTechnologyFieldObject, {
  encode: (field) => field,
  decode: (field) => {
    const result = ConfigurationTechnologyFieldObject.safeParse(field);
    if (result.success) {
      return result.data;
    }
    const rawTechArray = field['technologies'];
    const technologies = Array.isArray(rawTechArray)
      ? rawTechArray.map((tech) => ConfigurationTechnologyCodec.decode(tech))
      : [];
    return {
      label: safeDecodeWithFallback(z.string().safeDecode(field['label'] as string), null),
      short: safeDecodeWithFallback(z.string().safeDecode(field['short'] as string), null),
      programmes: safeDecodeWithFallback(
        z.array(z.string()).safeDecode(field['programmes'] as string[]),
        [] as string[],
      ),
      style: safeDecodeWithFallback(
        ConfigurationTechnologyStyleCodec.safeDecode(field['style'] as Record<string, unknown>),
        { color: null, accent: null },
      ),
      technologies,
    };
  },
});
