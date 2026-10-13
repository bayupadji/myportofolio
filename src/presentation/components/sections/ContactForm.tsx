"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Copy,
  Check,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { LinkedinIcon } from "@/presentation/components/ui/Icons";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { MessageTopic } from "@/domain/entities/Message";

import { useContactMutation } from "@/presentation/hooks/useContactMutation";

export interface ContactFormProps {
  email: string;
  locale?: Locale;
  messages: Messages;
}

export const ContactForm: React.FC<ContactFormProps> = ({ email, locale, messages }) => {
  const searchParams = useSearchParams();
  const queryTopic = searchParams.get("topic") as MessageTopic | null;
  const initialTopic: MessageTopic =
    queryTopic && ["job", "freelance", "other"].includes(queryTopic)
      ? queryTopic
      : "freelance";

  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [topic, setTopic] = useState<MessageTopic>(initialTopic);
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const contactMutation = useContactMutation();

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic inline validation
    if (!name.trim()) {
      setError(locale === "id" ? "Nama wajib diisi." : "Name is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail.trim())) {
      setError(locale === "id" ? "Alamat email tidak valid." : "A valid email is required.");
      return;
    }
    if (body.trim().length < 10) {
      setError(
        locale === "id"
          ? "Pesan minimal 10 karakter."
          : "Message must be at least 10 characters."
      );
      return;
    }

    contactMutation.mutate(
      {
        name,
        email: senderEmail,
        topic,
        body,
        honeypot,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setName("");
          setSenderEmail("");
          setBody("");
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : locale === "id"
              ? "Gagal mengirim pesan. Silakan coba lagi."
              : "Failed to send message. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] block mb-3">
                {messages.contact.badge}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-4">
                {messages.contact.title}
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                {messages.contact.subtitle}
              </p>

              <div className="space-y-4">
                {/* One-click email copy */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">
                        {messages.contact.directEmail}
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="p-2.5 rounded-[16px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={messages.contact.copyEmail}
                    title={messages.contact.copyEmail}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </button>
                </div>

                {/* LinkedIn Link */}
                <a
                  href="https://linkedin.com/in/bayu-designer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between group min-h-[64px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <LinkedinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">LinkedIn</span>
                      <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        linkedin.com/in/bayu-designer
                      </span>
                    </div>
                  </div>
                </a>

                {/* Resume Download */}
                <a
                  href="/cv/Bayu-Product-Designer-Resume.pdf"
                  download
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between group min-h-[64px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Curriculum Vitae</span>
                      <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {messages.nav.resume}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
              {locale === "id"
                ? "Respon rata-rata: 24-48 jam kerja (Senin - Jumat)."
                : "Average response time: 24-48 business hours (Mon - Fri)."}
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
              {success ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-12 flex flex-col items-center text-center animate-in fade-in duration-300"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)] mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                    {locale === "id" ? "Pesan Terkirim!" : "Message Received!"}
                  </h2>
                  <p className="text-base text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
                    {messages.contact.success}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-[16px] border border-[var(--border)] text-sm font-semibold hover:bg-[var(--surface-hover)] min-h-[44px]"
                  >
                    {locale === "id" ? "Kirim Pesan Lain" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Honeypot field (hidden from real users to catch spambots) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-trap">Leave this blank</label>
                    <input
                      id="website-trap"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="p-4 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)] text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold text-[var(--text)] mb-2"
                    >
                      {messages.contact.nameLabel}{" "}
                      <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={messages.contact.namePlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-[var(--text)] mb-2"
                    >
                      {messages.contact.emailLabel}{" "}
                      <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder={messages.contact.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                    />
                  </div>

                  {/* Topic Selection */}
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-sm font-semibold text-[var(--text)] mb-2"
                    >
                      {messages.contact.topicLabel}
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as MessageTopic)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors min-h-[44px]"
                    >
                      <option value="freelance">{messages.contact.topicFreelance}</option>
                      <option value="job">{messages.contact.topicJob}</option>
                      <option value="other">{messages.contact.topicOther}</option>
                    </select>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label
                      htmlFor="contact-body"
                      className="block text-sm font-semibold text-[var(--text)] mb-2"
                    >
                      {messages.contact.messageLabel}{" "}
                      <span className="text-[var(--accent)]">*</span>
                    </label>
                    <textarea
                      id="contact-body"
                      required
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={messages.contact.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-95 disabled:opacity-50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[48px]"
                  >
                    {contactMutation.isPending ? (
                      <span>{messages.contact.submitting}</span>
                    ) : (
                      <>
                        <span>{messages.contact.submit}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
