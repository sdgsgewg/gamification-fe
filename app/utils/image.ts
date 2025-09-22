import { RcFile } from "antd/es/upload";

export function getImageSrc(
  imageFile: File | RcFile | string
): string | undefined {
  if (!imageFile) return undefined;

  // Kalau sudah URL string
  if (typeof imageFile === "string") {
    return `${imageFile}?t=${Date.now()}`; // cache busting
  }

  // Kalau File / RcFile
  if (imageFile instanceof File) {
    return URL.createObjectURL(imageFile);
  }

  return undefined;
}
