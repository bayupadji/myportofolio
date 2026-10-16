import test from "node:test";
import assert from "node:assert/strict";

function validatePdfUpload(fileBuffer: Buffer, fileName: string, maxSizeBytes = 5 * 1024 * 1024): void {
  if (fileBuffer.length > maxSizeBytes) {
    throw new Error(`Document exceeds maximum allowed size of ${maxSizeBytes / (1024 * 1024)} MB`);
  }

  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (ext !== ".pdf") {
    throw new Error("Only PDF documents are allowed for CV uploads.");
  }

  const isPdfHeader =
    fileBuffer.length >= 5 &&
    fileBuffer[0] === 0x25 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x44 &&
    fileBuffer[3] === 0x46 &&
    fileBuffer[4] === 0x2d;

  if (!isPdfHeader) {
    throw new Error("Invalid file content: The uploaded file is not a valid PDF document.");
  }
}

test("validatePdfUpload accepts genuine PDF files with %PDF- header", () => {
  const validPdfBuffer = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj");
  assert.doesNotThrow(() => {
    validatePdfUpload(validPdfBuffer, "resume.pdf");
  });
});

test("validatePdfUpload rejects non-PDF file content even with .pdf extension", () => {
  const fakePdfBuffer = Buffer.from("<html><script>malicious()</script></html>");
  assert.throws(
    () => validatePdfUpload(fakePdfBuffer, "exploit.pdf"),
    { message: /not a valid PDF document/ }
  );
});

test("validatePdfUpload rejects non-PDF file extensions", () => {
  const buffer = Buffer.from("%PDF-1.7\nsample");
  assert.throws(
    () => validatePdfUpload(buffer, "resume.docx"),
    { message: /Only PDF documents are allowed/ }
  );
});

test("validatePdfUpload rejects files exceeding size limit", () => {
  const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 0x25); // 6 MB
  assert.throws(
    () => validatePdfUpload(largeBuffer, "huge_resume.pdf", 5 * 1024 * 1024),
    { message: /exceeds maximum allowed size/ }
  );
});
