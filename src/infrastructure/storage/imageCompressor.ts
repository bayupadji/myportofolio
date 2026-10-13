/**
 * Image compression utility using native HTML5 Canvas & WebP encoding.
 * Ensures all images uploaded to Supabase Storage are compressed client-side,
 * saving 85-95% bandwidth and storage quota.
 */

export type ImagePreset = "cover" | "avatar" | "thumbnail" | "custom";

export interface CompressionOptions {
  preset?: ImagePreset;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0 (default 0.80)
  mimeType?: "image/webp" | "image/jpeg";
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  width: number;
  height: number;
  format: string;
}

const PRESET_CONFIGS: Record<ImagePreset, { maxWidth: number; maxHeight: number; quality: number }> = {
  cover: { maxWidth: 1920, maxHeight: 1920, quality: 0.80 },
  avatar: { maxWidth: 800, maxHeight: 800, quality: 0.80 },
  thumbnail: { maxWidth: 600, maxHeight: 600, quality: 0.80 },
  custom: { maxWidth: 1920, maxHeight: 1920, quality: 0.80 },
};

/**
 * Compresses an image File using native browser Canvas API.
 * Automatically downscales dimensions while preserving aspect ratio,
 * and encodes into WebP format at target quality.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  // If not running in browser (e.g. SSR), return original file
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savedBytes: 0,
      savedPercentage: 0,
      width: 0,
      height: 0,
      format: file.type,
    };
  }

  const preset = options.preset || "cover";
  const config = PRESET_CONFIGS[preset];
  const maxWidth = options.maxWidth ?? config.maxWidth;
  const maxHeight = options.maxHeight ?? config.maxHeight;
  const quality = options.quality ?? config.quality;
  const targetMime = options.mimeType ?? "image/webp";

  return new Promise<CompressionResult>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file"));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error("Failed to decode image data"));

      img.onload = () => {
        // Calculate constrained dimensions preserving aspect ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Draw onto canvas for compression & format conversion
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          reject(new Error("Could not acquire 2D canvas context"));
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with target format & quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image to Blob"));
              return;
            }

            // Create new File with .webp extension and sanitized name
            const rawName = file.name.replace(/\.[^/.]+$/, "");
            const ext = targetMime === "image/webp" ? "webp" : "jpg";
            const sanitizedName = `${rawName.replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`;

            const compressedFile = new File([blob], sanitizedName, {
              type: targetMime,
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = compressedFile.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const savedPercentage =
              originalSize > 0
                ? Math.round((savedBytes / originalSize) * 1000) / 10
                : 0;

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize,
              savedBytes,
              savedPercentage,
              width,
              height,
              format: targetMime,
            });
          },
          targetMime,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable string (KB, MB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
