import Button from "@/app/components/shared/Button";
import { CreateTaskRequest } from "@/app/interface/tasks/requests/ICreateTaskRequest";
import Image from "next/image";
import { UpdateTaskRequest } from "@/app/interface/tasks/requests/IUpdateTaskRequest";
import DetailPageWrapper from "../../../shared/detail-page/DetailPageWrapper";
import {
  DurationTable,
  TaskDetailInformationTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { useEffect, useState } from "react";
import { getDateTime, getDuration } from "@/app/utils/date";
import QuestionCard from "./QuestionCard";
import { getImageSrc } from "@/app/utils/image";
import ModifyTaskNavigationBarWrapper from "./ModifyTaskNavigationBarWrapper";
import {
  TaskDifficulty,
  TaskDifficultyLabels,
} from "@/app/enums/TaskDifficulty";

interface ModifyTaskSummaryContentProps {
  payload: CreateTaskRequest | UpdateTaskRequest;
  subjectData: SubjectOverviewResponse[];
  materialData: MaterialOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onBack: () => void;
  onSubmit: () => void;
}

const ModifyTaskSummaryContent = ({
  payload,
  subjectData,
  materialData,
  taskTypeData,
  gradeData,
  onBack,
  onSubmit,
}: ModifyTaskSummaryContentProps) => {
  const [subjectName, setSubjectName] = useState<string>("");
  const [materialName, setMaterialName] = useState<string>("");
  const [taskTypeName, setTaskTypeName] = useState<string>("");
  const [taskGrade, setTaskGrade] = useState<string>("");

  useEffect(() => {
    if (payload?.subjectId) {
      const subject = subjectData.find(
        (s) => s.subjectId === payload.subjectId
      );
      setSubjectName(subject?.name ?? "");
    }

    if (payload?.materialId) {
      const material = materialData.find(
        (m) => m.materialId === payload.materialId
      );
      setMaterialName(material?.name ?? "");
    }

    if (payload?.taskTypeId) {
      const taskType = taskTypeData.find(
        (t) => t.taskTypeId === payload.taskTypeId
      );
      setTaskTypeName(taskType?.name ?? "");
    }

    if (payload?.gradeIds?.length) {
      // join semua grade yang ada di payload.gradeIds
      const grades = gradeData
        .filter((g) => payload.gradeIds.includes(g.gradeId))
        .map((g) => g.name.replace("Kelas", ""))
        .join(", ");
      setTaskGrade(grades);
    }
  }, [payload, subjectData, materialData, taskTypeData, gradeData]);

  const LeftSideContent = () => {
    if (!payload) return;

    let imageSrc = null;

    if (payload.imageFile) {
      imageSrc = getImageSrc(payload.imageFile);
    }

    return (
      <div className="flex flex-col gap-4 text-black">
        <h2 className="text-2xl font-semibold">{payload.title}</h2>
        {imageSrc && (
          <div className="w-60">
            <Image
              src={imageSrc}
              alt="Task Image"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-row items-center gap-2">
            <Image
              src={"/img/description.png"}
              alt="description"
              width={24}
              height={24}
            />
            <p className="text-base font-medium">Deskripsi</p>
          </div>
          <p className="text-sm text-justify">{payload.description}</p>
        </div>
      </div>
    );
  };

  const RightSideContent = () => {
    const { questions, difficulty, startTime, endTime } = payload;

    return (
      <>
        {/* Informasi Detail */}
        <TaskDetailInformationTable
          subject={subjectName}
          material={materialName}
          type={taskTypeName}
          questionCount={questions.length}
          // difficulty={TaskDifficultyLabels[difficulty as TaskDifficulty]}
          difficulty={
            TaskDifficultyLabels[difficulty as TaskDifficulty] ?? difficulty
          }
          grade={taskGrade}
        />

        {/* Waktu Pengerjaan */}
        <DurationTable
          startTime={getDateTime(startTime ?? null)}
          endTime={getDateTime(endTime ?? null)}
          duration={getDuration(startTime ?? null, endTime ?? null)}
        />
      </>
    );
  };

  const BottomContent = () => {
    return (
      <>
        <h2 className="text-black font-semibold text-2xl mb-4">Daftar Soal</h2>

        <div className="flex flex-col gap-8">
          {payload.questions.map((q, idx) => (
            <QuestionCard key={idx} index={idx} question={q} fromPage="edit" />
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <ModifyTaskNavigationBarWrapper fromView="task-summary" onBack={onBack} />

      {payload && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
          bottom={<BottomContent />}
        />
      )}

      <Button
        type="primary"
        size="large"
        variant="primary"
        className="!px-8"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </>
  );
};

export default ModifyTaskSummaryContent;
