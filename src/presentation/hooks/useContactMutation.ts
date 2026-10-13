"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { MessageTopic } from "@/domain/entities/Message";

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  topic: MessageTopic;
  body: string;
  honeypot?: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
}

export function useContactMutation() {
  const queryClient = useQueryClient();

  return useMutation<ContactSubmissionResponse, Error, ContactSubmissionPayload>({
    mutationFn: async (payload) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate admin messages cache so any open admin view updates
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}
