"use client";

import { useQuery } from "@tanstack/react-query";

import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { TaskTypeDetailResponse } from "@/app/interface/task-types/responses/ITaskTypeDetailResponse";
import { ManageItemMode } from "@/app/types/ManageItemMode";
import { EditTaskTypeFormInputs } from "@/app/schemas/task-types/editTaskType";

type ModeReturnType<M extends ManageItemMode> = M extends "detail"
  ? TaskTypeDetailResponse
  : EditTaskTypeFormInputs;

export const useTaskTypeDetail = <M extends ManageItemMode>(
  slug: string,
  mode: M
) => {
  return useQuery<ModeReturnType<M>>({
    queryKey: ["taskTypeDetail", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await taskTypeProvider.getTaskTypeDetail(slug);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail tipe tugas");

      const tt = res.data;

      if (mode === "edit") {
        // Mode edit
        const mapped: EditTaskTypeFormInputs = {
          taskTypeId: tt.taskTypeId,
          name: tt.name,
          description: tt.description || "",
          scope: tt.scope || "",
          hasDeadline: tt.hasDeadline.toString(),
          isCompetitive: tt.isCompetitive.toString(),
          isRepeatable: tt.isRepeatable.toString(),
          pointMultiplier: tt.pointMultiplier,
          updatedBy: "",
        };
        return mapped as ModeReturnType<M>;
      }

      // Mode detail
      const mapped: TaskTypeDetailResponse = {
        taskTypeId: tt.taskTypeId,
        name: tt.name,
        slug: tt.slug,
        description: tt.description ?? "",
        scope: tt.scope,
        hasDeadline: tt.hasDeadline,
        isCompetitive: tt.isCompetitive,
        isRepeatable: tt.isRepeatable,
        pointMultiplier: tt.pointMultiplier,
        createdBy: tt.createdBy,
        updatedBy: tt.updatedBy ?? "-",
      };
      return mapped as ModeReturnType<M>;
    },
  });
};
