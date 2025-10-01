import { useEffect } from "react";

/**
 * Cleanup blob URLs saat unmount (task)
 * Notes: keknya gak perlu
 */
export function useRevokeBlobUrls(fileList: { url?: string }[]) {
  useEffect(() => {
    return () => {
      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          if (file.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      }
    };
  }, [fileList]);
}
