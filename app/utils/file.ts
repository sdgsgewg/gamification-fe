import { RcFile, UploadFile } from "antd/es/upload";

// Helper function to convert File to RcFile
export const fileToRcFile = (file: File): RcFile => {
  return {
    ...file,
    uid: Math.random().toString(36).substring(2),
    lastModifiedDate: new Date(),
  } as RcFile;
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
