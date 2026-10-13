import en from "@/../src/presentation/i18n/messages/en.json";
import id from "@/../src/presentation/i18n/messages/id.json";
import { Locale } from "@/domain/value-objects/LocalizedText";

export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  if (locale === "id") {
    return id as Messages;
  }
  return en;
}
