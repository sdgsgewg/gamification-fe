"use client";

import { useMemo, useState, useEffect } from "react";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { Role } from "@/app/enums/Role";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";
import {
  TaskDifficulty,
  TaskDifficultyLabels,
} from "@/app/enums/TaskDifficulty";
import { useInitializeMaterialBasedOnSelectedSubject } from "./useInitializeMaterialBasedOnSelectedSubject";

interface UseUpsertTaskOverviewFormParams {
  role: Role;
  subjectData: SubjectOverviewResponse[];
  materialData: MaterialOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  selectedSubjectId: string | undefined;
}

export const useUpsertTaskOverviewForm = ({
  role,
  subjectData,
  materialData,
  taskTypeData,
  gradeData,
  selectedSubjectId,
}: UseUpsertTaskOverviewFormParams) => {
  // ============================
  // FILTER MATERIAL BY SUBJECT
  // ============================
  const [filteredMaterials, setFilteredMaterials] = useState<
    MaterialOverviewResponse[]
  >([]);

  // useEffect(() => {
  //   if (!selectedSubjectId) return setFilteredMaterials([]);

  //   const filtered = materialData.filter(
  //     (m) => m.subject === selectedSubjectId
  //   );
  //   setFilteredMaterials(filtered);
  // }, [selectedSubjectId, materialData]);

  // ============================
  // SUBJECT OPTIONS
  // ============================
  const subjectOptions = useMemo(
    () =>
      subjectData.map((subject) => ({
        value: subject.subjectId,
        label: subject.name,
      })),
    [subjectData]
  );

  // ============================
  // MATERIAL OPTIONS
  // ============================
  const materialOptions = useMemo(
    () =>
      filteredMaterials.map((material) => ({
        value: material.materialId,
        label: material.name,
      })),
    [filteredMaterials]
  );

  // ============================
  // TASK TYPE OPTIONS
  // ============================
  const taskTypeOptions = useMemo(() => {
    const validTaskType =
      role === Role.ADMIN
        ? taskTypeData.filter(
            (data) => data.scope.toUpperCase() !== TaskTypeScope.CLASS
          )
        : taskTypeData;

    return validTaskType.map((taskType) => ({
      value: taskType.taskTypeId,
      label: taskType.name,
      description: taskType.description,
    }));
  }, [role, taskTypeData]);

  // ============================
  // GRADE OPTIONS
  // ============================
  const gradeOptions = useMemo(
    () =>
      gradeData.map((grade) => ({
        value: grade.gradeId,
        label: grade.name,
      })),
    [gradeData]
  );

  // ============================
  // DIFFICULTY OPTIONS
  // ============================
  const difficultyOptions = useMemo(
    () =>
      Object.values(TaskDifficulty).map((value) => ({
        value,
        label: TaskDifficultyLabels[value],
      })),
    []
  );

  return {
    subjectOptions,
    materialOptions,
    taskTypeOptions,
    gradeOptions,
    difficultyOptions,
    filteredMaterials,
  };
};
