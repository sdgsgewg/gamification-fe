"use client";

import { useQuery } from "@tanstack/react-query";
import { ManageItemMode } from "@/app/types/ManageItemMode";
import { MaterialDetailResponse } from "@/app/interface/materials/responses/IMaterialDetailResponse";
import { EditMaterialFormInputs } from "@/app/schemas/materials/editMaterial";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { getImageSrc } from "@/app/utils/image";

type ModeReturnType<M extends ManageItemMode> = M extends "detail"
  ? MaterialDetailResponse
  : EditMaterialFormInputs;

export const useMaterialDetail = <M extends ManageItemMode>(
  slug: string,
  mode: M
) => {
  return useQuery<ModeReturnType<M>>({
    queryKey: ["materialDetail", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await materialProvider.getMaterialDetail(slug);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail materi pelajaran");

      const m = res.data;

      if (mode === "edit") {
        // Mode edit
        const mapped: EditMaterialFormInputs = {
          materialId: m.materialId,
          name: m.name,
          description: m.description ?? "",
          subjectId: m.subject.subjectId,
          gradeIds: m.materialGradeIds,
          updatedBy: "",
          image: m.image ? getImageSrc(m.image) : "",
          imageFile: null,
        };
        return mapped as ModeReturnType<M>;
      }

      // Mode detail
      const mapped: MaterialDetailResponse = {
        materialId: m.materialId,
        name: m.name,
        slug: m.slug,
        description: m.description ?? "",
        image: m.image ? getImageSrc(m.image) : "",
        subject: m.subject ?? { subjectId: "", name: "" },
        materialGradeIds: m.materialGradeIds ?? [],
        materialGrade: m.materialGrade ?? "-",
        createdBy: m.createdBy,
        updatedBy: m.updatedBy ?? "-",
      };
      return mapped as ModeReturnType<M>;
    },
  });
};
