import en from "@/../src/presentation/i18n/messages/en.json";

export type Messages = typeof en;

export function getMessages(): Messages {
  return en;
}

