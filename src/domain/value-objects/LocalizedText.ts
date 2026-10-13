export type Locale = "en" | "id";

export interface LocalizedText {
  en: string;
  id?: string;
}

export function resolveLocalized(
  value: LocalizedText | string | undefined,
  locale?: Locale
): { text: string; isFallback: boolean } {
  if (!value) return { text: "", isFallback: false };
  if (typeof value === "string") return { text: value, isFallback: false };
  if (locale === "id" && value.id && value.id.trim().length > 0) {
    return { text: value.id, isFallback: false };
  }
  return { text: value.en || value.id || "", isFallback: false };
}

export function loc(en: string, id: string = en): LocalizedText {
  return { en, id };
}

