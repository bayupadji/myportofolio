"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { MessageTopic } from "@/domain/entities/Message";
import { submitContactMessageAction } from "../actions/messageActions";

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
      // Honeypot anti-spam check
      if (payload.honeypot && payload.honeypot.trim().length > 0) {
        return { success: true, message: "Thank you for your message." };
      }

      const res = await submitContactMessageAction({
        name: payload.name,
        email: payload.email,
        topic: payload.topic,
        body: payload.body,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to submit message.");
      }

      return { success: true, message: "Your message has been sent successfully." };
    },
    onSuccess: () => {
      // Invalidate admin messages cache so any open admin view updates
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}
