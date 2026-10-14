import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export interface CompressionResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  width: number;
  height: number;
  format: string;
  fileName: string;
}

export interface DocumentUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export type UploadSubfolder = "projects" | "profile" | "cv" | "general";

const UPLOADS_BASE_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure target directory exists
async function ensureDir(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Server-side local file storage and image compressor using Sharp.
 * Enforces WebP format, max-width 1200px, quality 80%.
 */
export class LocalFileStorageService {
  /**
   * Compresses and saves an image to /public/uploads/[folder]/
   */
  async saveCompressedImage(
    fileBuffer: Buffer,
    originalName: string,
    subfolder: UploadSubfolder = "projects",
    options: { maxWidth?: number; quality?: number } = {}
  ): Promise<CompressionResult> {
    const maxWidth = options.maxWidth ?? 1200;
    const quality = options.quality ?? 80;

    const targetDir = path.join(UPLOADS_BASE_DIR, subfolder);
    await ensureDir(targetDir);

    const originalSize = fileBuffer.length;

    // Use Sharp to resize and convert to WebP
    const imagePipeline = sharp(fileBuffer);
    const metadata = await imagePipeline.metadata();

    const currentWidth = metadata.width || 0;
    const resizeWidth = currentWidth > maxWidth ? maxWidth : undefined;

    const processedBuffer = await imagePipeline
      .resize({
        width: resizeWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 4,
      })
      .toBuffer();

    const processedMeta = await sharp(processedBuffer).metadata();

    // Sanitize filename
    const cleanBaseName = path
      .parse(originalName)
      .name.replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const finalFileName = `${cleanBaseName}-${timestamp}-${randomSuffix}.webp`;
    const targetFilePath = path.join(targetDir, finalFileName);

    // Save to disk
    await fs.writeFile(targetFilePath, processedBuffer);

    const compressedSize = processedBuffer.length;
    const savedBytes = Math.max(0, originalSize - compressedSize);
    const savedPercentage =
      originalSize > 0
        ? Math.round((savedBytes / originalSize) * 1000) / 10
        : 0;

    const publicUrl = `/uploads/${subfolder}/${finalFileName}`;

    return {
      url: publicUrl,
      originalSize,
      compressedSize,
      savedBytes,
      savedPercentage,
      width: processedMeta.width || currentWidth,
      height: processedMeta.height || 0,
      format: "image/webp",
      fileName: finalFileName,
    };
  }

  /**
   * Saves document (e.g. CV in PDF format) without image compression.
   */
  async saveDocument(
    fileBuffer: Buffer,
    originalName: string,
    subfolder: UploadSubfolder = "cv",
    maxSizeBytes: number = 5 * 1024 * 1024 // 5 MB default
  ): Promise<DocumentUploadResult> {
    if (fileBuffer.length > maxSizeBytes) {
      throw new Error(`Document exceeds maximum allowed size of ${maxSizeBytes / (1024 * 1024)} MB`);
    }

    const ext = path.extname(originalName).toLowerCase();
    if (ext !== ".pdf") {
      throw new Error("Only PDF documents are allowed for CV uploads.");
    }

    const targetDir = path.join(UPLOADS_BASE_DIR, subfolder);
    await ensureDir(targetDir);

    const cleanBaseName = path
      .parse(originalName)
      .name.replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const finalFileName = `${cleanBaseName}-${timestamp}-${randomSuffix}.pdf`;
    const targetFilePath = path.join(targetDir, finalFileName);

    await fs.writeFile(targetFilePath, fileBuffer);

    return {
      url: `/uploads/${subfolder}/${finalFileName}`,
      fileName: finalFileName,
      fileSize: fileBuffer.length,
      mimeType: "application/pdf",
    };
  }
}

export const localFileStorage = new LocalFileStorageService();
