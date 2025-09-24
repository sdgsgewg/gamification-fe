import { RcFile, UploadFile } from "antd/es/upload";

export function getImageSrc(
  imageFile?: File | RcFile | UploadFile | string | null
): string | undefined {
  if (!imageFile) return undefined;

  // Kalau sudah string → bisa url / base64
  if (typeof imageFile === "string") {
    return `${imageFile}?t=${Date.now()}`; // tambahin cache-busting
  }

  // Kalau File / RcFile
  if (imageFile instanceof File) {
    return URL.createObjectURL(imageFile);
  }

  // Kalau UploadFile (punya url / originFileObj)
  const uploadFile = imageFile as UploadFile;

  if (uploadFile.url) {
    return uploadFile.url; // bisa base64 atau objectURL
  }

  if (uploadFile.originFileObj) {
    return URL.createObjectURL(uploadFile.originFileObj);
  }

  return undefined;
}
