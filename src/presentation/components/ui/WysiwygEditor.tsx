"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RemoveFormatting,
  Code,
  Eye,
} from "lucide-react";

export interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your achievements or bullet points here...",
  minHeight = "160px",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  // Sync external value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current && mode === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, mode]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (mode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("bold");
            }}
            title="Bold (Ctrl+B / ⌘B)"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("italic");
            }}
            title="Italic (Ctrl+I / ⌘I)"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("underline");
            }}
            title="Underline (Ctrl+U / ⌘U)"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("insertUnorderedList");
            }}
            title="Bulleted List"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("insertOrderedList");
            }}
            title="Numbered List"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand("removeFormat");
            }}
            title="Clear Formatting"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle: Visual vs HTML Source */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode(mode === "visual" ? "html" : "visual")}
            className="px-2 py-1 text-[11px] font-medium rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-1.5 cursor-pointer"
            title={mode === "visual" ? "Edit HTML Source" : "Switch to Visual WYSIWYG"}
          >
            {mode === "visual" ? (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>HTML</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="p-3.5 text-xs text-[var(--text)] outline-none leading-relaxed prose prose-sm dark:prose-invert max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--text-muted)] empty:before:pointer-events-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1"
        />
      ) : (
        <textarea
          value={value}
          onChange={handleHtmlChange}
          style={{ minHeight }}
          placeholder="<p>Enter HTML source directly...</p>"
          className="w-full p-3.5 text-xs font-mono text-[var(--text)] bg-[var(--background)] outline-none resize-y leading-relaxed"
        />
      )}
    </div>
  );
};
