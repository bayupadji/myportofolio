import { getSupabaseClient } from "./client";
import {
  compressImage,
  CompressionOptions,
  CompressionResult,
} from "../storage/imageCompressor";

export interface UploadImageParams {
  file: File;
  bucket?: string; // default: "portfolio-assets"
  folder?: string; // e.g. "projects", "avatars"
  preset?: CompressionOptions["preset"]; // "cover" | "avatar" | "thumbnail"
  customOptions?: CompressionOptions;
  upsert?: boolean;
}

export interface UploadImageResult {
  publicUrl: string;
  filePath: string;
  compression: CompressionResult;
}

/**
 * Service to upload images to Supabase Storage with MANDATORY client-side compression.
 * Enforces WebP format, dimension clamping, and 80% quality before any byte reaches the server.
 */
export async function uploadCompressedImageToSupabase({
  file,
  bucket = "portfolio-assets",
  folder = "projects",
  preset = "cover",
  customOptions = {},
  upsert = true,
}: UploadImageParams): Promise<UploadImageResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are present in .env.local."
    );
  }

  // 1. Mandatory Compression Step
  const compression = await compressImage(file, {
    preset,
    ...customOptions,
  });

  const compressedFile = compression.file;

  // 2. Build sanitized unique file path
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const baseName = compressedFile.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}-${timestamp}-${randomSuffix}.webp`;
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const filePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, compressedFile, {
      contentType: "image/webp",
      cacheControl: "31536000", // Cache for 1 year in CDN
      upsert,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  // 4. Retrieve Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    publicUrl,
    filePath: data.path,
    compression,
  };
}
