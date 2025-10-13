"use client";

import { useQuery } from "@tanstack/react-query";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { SubjectDetailResponse } from "@/app/interface/subjects/responses/ISubjectDetailResponse";
import { EditSubjectFormInputs } from "@/app/schemas/subjects/editSubject";
import { getImageSrc } from "@/app/utils/image";
import { ManageItemMode } from "@/app/types/ManageItemMode";

type ModeReturnType<M extends ManageItemMode> = M extends "detail"
  ? SubjectDetailResponse
  : EditSubjectFormInputs;

export const useSubjectDetail = <M extends ManageItemMode>(
  slug: string,
  mode: M
) => {
  return useQuery<ModeReturnType<M>>({
    queryKey: ["subjectDetail", slug, mode],
    enabled: !!slug,
    queryFn: async () => {
      const res = await subjectProvider.getSubjectDetail(slug!);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail mata pelajaran");

      const s = res.data;

      if (mode === "edit") {
        // Mode edit
        const mapped: EditSubjectFormInputs = {
          subjectId: s.subjectId,
          name: s.name,
          description: s.description ?? "",
          updatedBy: "",
          image: s.image ? getImageSrc(s.image) : "",
          imageFile: null,
        };
        return mapped as ModeReturnType<M>;
      }

      // Mode detail
      const mapped: SubjectDetailResponse = {
        subjectId: s.subjectId,
        name: s.name,
        slug: s.slug,
        description: s.description ?? "",
        image: s.image ? getImageSrc(s.image) : "",
        createdBy: s.createdBy,
        updatedBy: s.updatedBy ?? "-",
      };
      return mapped as ModeReturnType<M>;
    },
  });
};
