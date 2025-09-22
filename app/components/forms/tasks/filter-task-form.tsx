"use client";

import { Form } from "antd";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { materialProvider } from "@/app/functions/MaterialProvider";
import {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

// --- Zod Schema ---
const filterTaskSchema = z.object({
  searchText: z.string().optional(),
  subjectId: z.string().optional(),
  materialId: z.string().optional(),
  taskTypeId: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
});

export type FilterTaskInputs = z.infer<typeof filterTaskSchema>;

export interface FilterTaskFormRef {
  resetForm: () => void;
}

interface FilterTaskFormProps {
  subjectData: SubjectOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: FilterTaskInputs) => void;
}

const FilterTaskForm = forwardRef<FilterTaskFormRef, FilterTaskFormProps>(
  ({ subjectData, taskTypeData, gradeData, onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      resetField,
      reset,
    } = useForm<FilterTaskInputs>({
      resolver: zodResolver(filterTaskSchema),
      defaultValues: {
        searchText: "",
        subjectId: "",
        materialId: "",
        taskTypeId: "",
        gradeIds: [],
      },
    });

    const selectedSubjectId = useWatch({ control, name: "subjectId" });

    const [materialData, setMaterialData] = useState<
      MaterialOverviewResponse[]
    >([]);

    const fetchMaterials = async (subjectName?: string) => {
      try {
        const res = await materialProvider.getMaterials({
          searchText: subjectName,
        });
        if (res.isSuccess && res.data) setMaterialData(res.data);
        else setMaterialData([]);
      } catch (error) {
        console.error("Failed to fetch materials: ", error);
        setMaterialData([]);
      }
    };

    const subjectOptions = useMemo(
      () =>
        subjectData.map((subject) => ({
          value: subject.subjectId,
          label: subject.name,
        })),
      [subjectData]
    );

    const materialOptions = useMemo(
      () =>
        materialData.map((material) => ({
          value: material.materialId,
          label: material.name,
        })),
      [materialData]
    );

    const taskTypeOptions = taskTypeData.map((taskType) => ({
      value: taskType.taskTypeId,
      label: taskType.name,
    }));

    const gradeOptions = gradeData.map((grade) => ({
      value: grade.gradeId,
      label: grade.name,
    }));

    useEffect(() => {
      if (selectedSubjectId) {
        const subject = subjectData.find(
          (s) => s.subjectId === selectedSubjectId
        );
        if (subject) {
          resetField("materialId");
          fetchMaterials(subject.name);
        }
      }
    }, [selectedSubjectId]);

    // Expose resetForm ke parent via ref
    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    return (
      <Form
        id="filter-task-form"
        name="filter-task"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <TextField
          control={control}
          name="searchText"
          label="Judul"
          placeholder="Masukkan judul tugas"
          errors={errors}
        />

        <SelectField
          control={control}
          name="subjectId"
          label="Mata Pelajaran"
          placeholder="Pilih mata pelajaran"
          options={subjectOptions}
          errors={errors}
          loading={subjectOptions.length === 0}
          disabled={subjectOptions.length === 0}
        />

        <SelectField
          control={control}
          name="materialId"
          label="Materi Pelajaran"
          placeholder="Pilih materi pelajaran"
          options={materialOptions}
          errors={errors}
          disabled={materialOptions.length === 0}
        />

        <SelectField
          control={control}
          name="taskTypeId"
          label="Tipe Tugas"
          placeholder="Pilih tipe tugas"
          options={taskTypeOptions}
          errors={errors}
          loading={taskTypeOptions.length === 0}
          disabled={taskTypeOptions.length === 0}
        />

        <SelectField
          control={control}
          name="gradeIds"
          label="Tingkat Kelas"
          placeholder="Pilih tingkat kelas"
          options={gradeOptions}
          loading={gradeOptions.length === 0}
          disabled={gradeOptions.length === 0}
          mode="multiple"
        />
      </Form>
    );
  }
);

FilterTaskForm.displayName = "FilterTaskForm";
export default FilterTaskForm;
