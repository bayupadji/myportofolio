"use server";

import {
  localFileStorage,
  UploadSubfolder,
  CompressionResult,
  DocumentUploadResult,
} from "@/infrastructure/storage/localFileStorage";
import { assertAdminSession } from "@/infrastructure/auth/session";

export interface UploadImageActionResponse {
  success: boolean;
  data?: CompressionResult;
  error?: string;
}

export interface UploadDocumentActionResponse {
  success: boolean;
  data?: DocumentUploadResult;
  error?: string;
}

export async function uploadImageAction(
  formData: FormData,
  folder: UploadSubfolder = "projects"
): Promise<UploadImageActionResponse> {
  try {
    await assertAdminSession();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided." };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Invalid file type. Only image files (JPEG, PNG, WebP) are supported.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await localFileStorage.saveCompressedImage(
      buffer,
      file.name,
      folder,
      { maxWidth: 1200, quality: 80 }
    );

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to compress and save image";
    return { success: false, error: message };
  }
}

/**
 * Server Action for uploading documents (PDF CV).
 * Validates document type & limit (5MB) and saves directly to disk.
 */
export async function uploadDocumentAction(
  formData: FormData,
  folder: UploadSubfolder = "cv"
): Promise<UploadDocumentActionResponse> {
  try {
    await assertAdminSession();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No document file provided." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await localFileStorage.saveDocument(
      buffer,
      file.name,
      folder,
      5 * 1024 * 1024 // 5 MB limit
    );

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload document";
    return { success: false, error: message };
  }
}
