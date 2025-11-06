"use client";

import { useQuery } from "@tanstack/react-query";
import { classProvider } from "@/app/functions/ClassProvider";
import { ClassDetailResponse } from "@/app/interface/classes/responses/IClassDetailResponse";
import { EditClassFormInputs } from "@/app/schemas/classes/editClass";
import { getImageSrc } from "@/app/utils/image";
import { ManageItemMode } from "@/app/types/ManageItemMode";

type ModeReturnType<M extends ManageItemMode> = M extends "detail"
  ? ClassDetailResponse
  : EditClassFormInputs;

export const useClassDetail = <M extends ManageItemMode>(
  slug: string,
  mode: M,
) => {
  return useQuery<ModeReturnType<M>>({
    queryKey: ["class-detail", slug, mode],
    enabled: !!slug,
    queryFn: async () => {
      const res = await classProvider.getClassDetail(slug!);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail kelas");

      const c = res.data;

      if (mode === "edit") {
        // Mode edit
        const mapped: EditClassFormInputs = {
          classId: c.id,
          name: c.name,
          description: c.description ?? "",
          updatedBy: "",
          image: c.image ? getImageSrc(c.image) : "",
          imageFile: null,
        };
        return mapped as ModeReturnType<M>;
      }

      // Mode detail
      const mapped: ClassDetailResponse = {
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        image: c.image ? getImageSrc(c.image) : "",
      };
      
      return mapped as ModeReturnType<M>;
    },
  });
};
