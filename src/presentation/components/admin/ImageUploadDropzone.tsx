"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import {
  uploadImageAction,
  uploadDocumentAction,
} from "@/presentation/actions/uploadActions";
import { UploadSubfolder } from "@/infrastructure/storage/localFileStorage";
import { toast } from "@/presentation/components/ui/Toast";

export interface CompressionResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  width: number;
  height: number;
  format: string;
}

export interface ImageUploadDropzoneProps {
  label?: string;
  mode?: "image" | "document";
  folder?: UploadSubfolder;
  onUploadComplete?: (publicUrl: string, result?: CompressionResult) => void;
  className?: string;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  label = "Upload & Compress Image",
  mode = "image",
  folder = "projects",
  onUploadComplete,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setUploadedUrl(null);
    setCompressionResult(null);

    if (mode === "image") {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (PNG, JPEG, WebP, etc.)");
        return;
      }
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrorMessage("Only PDF documents are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("PDF document size must not exceed 5 MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (mode === "image") {
        const res = await uploadImageAction(formData, folder);
        if (!res.success || !res.data) {
          throw new Error(res.error || "Image compression and upload failed.");
        }

        const compResult: CompressionResult = {
          url: res.data.url,
          originalSize: res.data.originalSize,
          compressedSize: res.data.compressedSize,
          savedBytes: res.data.savedBytes,
          savedPercentage: res.data.savedPercentage,
          width: res.data.width,
          height: res.data.height,
          format: res.data.format,
        };

        setCompressionResult(compResult);
        setUploadedUrl(res.data.url);
        toast.success(
          `Image compressed & uploaded (-${compResult.savedPercentage}% saved).`,
          "Upload Complete"
        );

        if (onUploadComplete) {
          onUploadComplete(res.data.url, compResult);
        }
      } else {
        const res = await uploadDocumentAction(formData, folder);
        if (!res.success || !res.data) {
          throw new Error(res.error || "Document upload failed.");
        }

        setUploadedUrl(res.data.url);
        toast.success("Document uploaded successfully.", "Upload Complete");
        if (onUploadComplete) {
          onUploadComplete(res.data.url);
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Upload to local storage failed.";
      setErrorMessage(msg);
      toast.error(msg, "Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[var(--text)]">
            {label}
          </label>
          <span className="text-xs font-mono text-[var(--accent)] font-medium">
            {mode === "image"
              ? "Sharp WebP (Max-width 1200px · 80% Quality)"
              : "PDF Document (Max 5MB)"}
          </span>
        </div>
      )}

      {/* Dropzone container */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)] hover:border-[var(--accent)]/60 hover:bg-[var(--surface-hover)] transition-all cursor-pointer text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={mode === "image" ? "image/*" : ".pdf,application/pdf"}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-3 group-hover:scale-105 transition-transform">
          {mode === "image" ? (
            <UploadCloud className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>

        <p className="text-sm font-semibold text-[var(--text)] mb-1">
          {mode === "image"
            ? "Click or drag & drop to compress image"
            : "Click or drag & drop CV PDF"}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {mode === "image"
            ? "PNG, JPEG, WebP → Server-side Sharp WebP auto compression"
            : "PDF file only, max size 5 MB"}
        </p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preview / Staged Card */}
      {selectedFile && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            {previewUrl ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <FileText className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-xs text-[var(--text)] truncate">
                  {selectedFile.name}
                </span>
                {compressionResult && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Saved {compressionResult.savedPercentage}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                {compressionResult ? (
                  <>
                    <span className="line-through text-red-500/80">
                      {formatBytes(compressionResult.originalSize)}
                    </span>
                    <span className="text-[var(--text)]">→</span>
                    <span className="font-bold text-[var(--success)]">
                      {formatBytes(compressionResult.compressedSize)} (WebP)
                    </span>
                    <span>· {compressionResult.width}×{compressionResult.height}px</span>
                  </>
                ) : (
                  <span>Original: {formatBytes(selectedFile.size)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Target: <code>/public/uploads/{folder}/</code></span>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || Boolean(uploadedUrl)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer min-h-[36px]"
            >
              {isUploading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing with Sharp...</span>
                </>
              ) : uploadedUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved to Local Storage!</span>
                </>
              ) : (
                <span>Upload & Compress Now</span>
              )}
            </button>
          </div>

          {/* Success URL Banner */}
          {uploadedUrl && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Upload Success</span>
              </div>
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="w-full px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] select-all"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
