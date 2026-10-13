"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import {
  compressImage,
  formatBytes,
  CompressionResult,
  ImagePreset,
} from "@/infrastructure/storage/imageCompressor";
import { uploadCompressedImageToSupabase } from "@/infrastructure/supabase/storageService";

export interface ImageUploadDropzoneProps {
  label?: string;
  preset?: ImagePreset;
  bucket?: string;
  folder?: string;
  onUploadComplete?: (publicUrl: string, result: CompressionResult) => void;
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  label = "Upload & Compress Image",
  preset = "cover",
  bucket = "portfolio-assets",
  folder = "projects",
  onUploadComplete,
  className = "",
}) => {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPEG, WebP, etc.)");
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);
    setUploadedUrl(null);

    try {
      // 1. Mandatory client-side compression
      const result = await compressImage(file, { preset });
      setCompressionResult(result);

      // Local preview from compressed blob
      const localUrl = URL.createObjectURL(result.file);
      setPreviewUrl(localUrl);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Image compression failed."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadToSupabase = async () => {
    if (!compressionResult) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const uploadRes = await uploadCompressedImageToSupabase({
        file: compressionResult.file,
        bucket,
        folder,
        preset,
      });

      setUploadedUrl(uploadRes.publicUrl);
      if (onUploadComplete) {
        onUploadComplete(uploadRes.publicUrl, compressionResult);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to upload to Supabase Storage."
      );
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
            Auto-converts to WebP (Quality 80%)
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
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-[var(--text)] mb-1">
          Click or drag & drop to compress image
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          PNG, JPEG, WebP, GIF (Max dimension: {preset === "avatar" ? "800px" : "1920px"})
        </p>
      </div>

      {/* Compressing status */}
      {isCompressing && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-muted)] animate-pulse">
          <Sparkles className="w-4 h-4 text-[var(--accent)] animate-spin" />
          <span>Compressing image to WebP with optimal resolution...</span>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Compression Comparison Card */}
      {compressionResult && previewUrl && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-xs text-[var(--text)] truncate">
                  {compressionResult.file.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Saved {compressionResult.savedPercentage}%
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                <span className="line-through text-red-500/80">
                  {formatBytes(compressionResult.originalSize)}
                </span>
                <span className="text-[var(--text)]">→</span>
                <span className="font-bold text-[var(--success)]">
                  {formatBytes(compressionResult.compressedSize)} (WebP)
                </span>
                <span>· {compressionResult.width}×{compressionResult.height}px</span>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Target: Supabase Storage bucket <code>{bucket}</code></span>
            </div>

            <button
              type="button"
              onClick={handleUploadToSupabase}
              disabled={isUploading || Boolean(uploadedUrl)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer min-h-[36px]"
            >
              {isUploading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : uploadedUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Uploaded to Storage!</span>
                </>
              ) : (
                <span>Confirm & Upload to Supabase</span>
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
