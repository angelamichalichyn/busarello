import { randomUUID } from "crypto";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export function isVercelBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não suportado (use JPG, PNG, WEBP ou AVIF)");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Imagem muito grande (máximo 8MB)");
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `products/${randomUUID()}${ext}`;

  if (isVercelBlobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  const { writeFile, mkdir } = await import("fs/promises");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadsDir, { recursive: true });
  const localFilename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, localFilename), buffer);
  return `/uploads/products/${localFilename}`;
}
