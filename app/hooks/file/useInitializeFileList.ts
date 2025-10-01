import { UploadFile } from "antd";
import { useEffect } from "react";

/**
 * Initialize file list dari image yang dikirim oleh server (untuk edit)
 */
export function useInitializeFileList(
  data: { image?: string } | undefined,
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
) {
  useEffect(() => {
    if (data?.image) {
      setFileList([
        {
          uid: "-1",
          name: "old-image.png",
          status: "done",
          url: data.image,
        } as UploadFile,
      ]);
    }
  }, [data, setFileList]);
}

/**
 * Saat memuat data dari parent, recreate blob URLs (task)
 * Untuk preview image saat pindah-pindah view task form (overview <-> question <-> summary)
 */
export function useInitializeFileListBetweenView(
  data: { imageFile?: any } | undefined,
  fileList: UploadFile[],
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
) {
  useEffect(() => {
    if (data?.imageFile && fileList.length === 0) {
      const url = URL.createObjectURL(data.imageFile);
      setFileList([
        {
          uid: "-1",
          name: "preview.jpg",
          status: "done",
          url: url,
          originFileObj: data.imageFile,
        },
      ]);
    }
  }, [data, fileList.length]);
}
