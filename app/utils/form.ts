import { useEffect, useState } from "react";
import { setItem } from "@/app/utils/storage";
import { auth } from "@/app/functions/AuthProvider";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
// import { fileToRcFile } from "./file";

/**
 * Inject default createdBy / creatorId ke form (untuk create)
 */
export function useInjectUser<
  T extends { creatorId?: string; createdBy?: string; updatedBy?: string }
>(
  setValue: UseFormSetValue<T>,
  fields: Array<keyof T> = ["creatorId", "createdBy"]
) {
  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      if (fields.includes("creatorId") && "userId" in user) {
        setValue("creatorId" as Path<T>, user.userId as PathValue<T, Path<T>>);
      }
      if (fields.includes("createdBy") && "name" in user) {
        setValue("createdBy" as Path<T>, user.name as PathValue<T, Path<T>>);
      }
    }
  }, [setValue]);
}

/**
 * Initialize form (untuk update)
 */
type Mapper<T> = (data: Partial<T>) => Partial<T>;

export function useInitializeForm<T>(
  reset: UseFormReset<T>,
  data?: Partial<T>,
  mapper?: Mapper<T>
) {
  useEffect(() => {
    if (data) {
      const mapped = mapper ? mapper(data) : data;
      reset(mapped as T);
    }
  }, [data, reset]);
}

/**
 * Initialize file list dari image yang dikirim oleh server
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
 * Autosave draft ke localStorage setiap ada perubahan
 */
export function useAutoSaveDraft<T extends FieldValues>(
  watchedValues: T,
  storageKey: string
) {
  useEffect(() => {
    if (!watchedValues) return;
    try {
      setItem(storageKey, JSON.stringify(watchedValues));
    } catch (error) {
      console.error(`Gagal menyimpan draft ${storageKey}:`, error);
    }
  }, [watchedValues, storageKey]);
}

/**
 * Cleanup blob URLs saat unmount
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

/**
 * Detect apakah form sudah diisi (dirty check manual)
 */
export function useDirtyCheck<T extends FieldValues>(
  watchedValues: T,
  ignoredKeys: (keyof T)[] = []
): boolean {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasData = Object.entries(watchedValues).some(([key, value]) => {
      if (ignoredKeys.includes(key as keyof T)) return false;

      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim() !== "";
      if (value instanceof Date) return true;
      return value !== null && value !== undefined;
    });

    setIsDirty(hasData);
  }, [watchedValues, ignoredKeys]);

  return isDirty;
}

/**
 * Dirty check untuk edit form:
 * true kalau ada field yang berubah dari defaultValues
 */
export function useDirtyCheckWithDefaults<T extends FieldValues>(
  watchedValues: T,
  defaultValues: Partial<T>,
  ignoredKeys: (keyof T)[] = []
): boolean {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!watchedValues || !defaultValues) return;

    console.log("Watched values: ", JSON.stringify(watchedValues, null, 2));
    console.log("Default values: ", JSON.stringify(defaultValues, null, 2));

    const hasDiff = Object.entries(watchedValues).some(([key, value]) => {
      if (ignoredKeys.includes(key as keyof T)) return false;

      const defaultValue = defaultValues[key as keyof T];

      // Bandingkan nilai sekarang dengan default
      if (Array.isArray(value)) {
        return JSON.stringify(value) !== JSON.stringify(defaultValue);
      }
      if (
        Object.prototype.toString.call(value) === "[object Date]" &&
        Object.prototype.toString.call(defaultValue) === "[object Date]"
      ) {
        return (value as Date).getTime() !== (defaultValue as Date).getTime();
      }

      return value !== defaultValue;
    });

    setIsDirty(hasDiff);
  }, [watchedValues, defaultValues, ignoredKeys]);

  return isDirty;
}
