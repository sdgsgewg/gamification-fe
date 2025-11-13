import { RcFile, UploadFile } from "antd/es/upload";

// Helper function to convert File to RcFile
export const fileToRcFile = (file: File): RcFile => {
  return {
    ...file,
    uid: Math.random().toString(36).substring(2),
    lastModifiedDate: new Date(),
  } as RcFile;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const urlToUploadFile = (
  url: string,
  filename: string = "image"
): UploadFile => {
  return {
    uid: "-1",
    name: filename,
    status: "done" as const,
    url: url,
  };
};
