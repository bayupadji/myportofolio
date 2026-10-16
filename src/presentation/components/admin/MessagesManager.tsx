"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Trash2,
  ExternalLink,
  Search,
  MessageSquare,
  Clock,
  User,
} from "lucide-react";
import { Message } from "@/domain/entities/Message";
import { toast } from "@/presentation/components/ui/Toast";
import { useDeleteMessageMutation } from "@/presentation/hooks/useAdminQueries";

interface MessagesManagerProps {
  initialMessages: Message[];
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({
  initialMessages,
}) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const deleteMessageMutation = useDeleteMessageMutation();

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.body.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedTopic !== "all") return m.topic === selectedTopic;
    return true;
  });

  const handleDelete = async (id: string, senderName: string) => {
    if (!window.confirm(`Delete message from "${senderName}"?`)) return;
    try {
      await deleteMessageMutation.mutateAsync(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Message from "${senderName}" was deleted.`, "Message Deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Inbound Messages & Briefs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {messages.length} {messages.length === 1 ? "Inquiry" : "Inquiries"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Client briefs and contact inquiries submitted through your public portfolio form.
          </p>
        </div>
      </div>

      {/* Search & Topic Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Topics" },
            { id: "freelance", label: "Freelance" },
            { id: "job", label: "Hiring / Role" },
            { id: "general", label: "General" },
          ].map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedTopic === topic.id
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--text-muted)] space-y-3">
            <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
            <p>No matching messages found.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-6 space-y-3 hover:bg-[var(--surface-hover)]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text)]">
                        {msg.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold uppercase tracking-wider">
                        {msg.topic}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--accent)] font-mono">
                      {msg.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.createdAt).toLocaleString("en-US")}</span>
                  </div>

                  <a
                    href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry (${msg.topic})`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] transition-colors min-h-[32px] cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Reply via Email</span>
                    <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="p-1.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                {msg.body}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

