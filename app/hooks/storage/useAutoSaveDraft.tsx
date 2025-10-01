import { setItem } from "@/app/utils/storage";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";

/**
 * Autosave draft ke localStorage setiap ada perubahan (task)
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
