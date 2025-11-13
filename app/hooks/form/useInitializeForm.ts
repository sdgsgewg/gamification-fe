import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";

/**
 * Initialize form (untuk edit)
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
