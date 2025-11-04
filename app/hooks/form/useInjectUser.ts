import { useEffect } from "react";
import { Path, PathValue, UseFormSetValue } from "react-hook-form";
import { useAuth } from "../useAuth";

/**
 * Inject default creatorId / createdBy ke form (untuk create)
 */
export function useInjectUser<
  T extends { creatorId?: string; createdBy?: string }
>(
  setValue: UseFormSetValue<T>,
  fields: Array<keyof T> = ["creatorId", "createdBy"]
) {
  const { getCachedUserProfile } = useAuth();

  useEffect(() => {
    const user = getCachedUserProfile();
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
