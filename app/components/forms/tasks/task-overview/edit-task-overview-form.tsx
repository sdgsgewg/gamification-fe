"use client";

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useForm, useWatch } from "react-hook-form";
import {
  editTaskOverviewDefaultValues,
  EditTaskOverviewFormInputs,
  editTaskOverviewSchema,
} from "@/app/schemas/tasks/task-overview/editTaskOverview";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../shared/Button";
import { auth } from "@/app/functions/AuthProvider";
import TextField from "../../../fields/TextField";
import TextAreaField from "../../../fields/TextAreaField";
import ImageField from "../../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import Loading from "../../../shared/Loading";
import SelectField from "../../../fields/SelectField";
import DateField from "../../../fields/DateField";
import TimeField from "../../../fields/TimeField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { combineDateTime } from "@/app/utils/date";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useInitializeForm } from "@/app/hooks/form/useInitializeForm";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";
import { useInitializeMaterialBasedOnSelectedSubject } from "@/app/hooks/form/useInitializeMaterialBasedOnSelectedSubject";
import {
  useInitializeFileList,
  useInitializeFileListBetweenView,
} from "@/app/hooks/file/useInitializeFileList";
import { EditTaskQuestionFormInputs } from "@/app/schemas/tasks/task-questions/editTaskQuestion";
import { isEqual } from "lodash";

interface EditTaskOverviewFormProps {
  taskOverviewDefaultValue: EditTaskOverviewFormInputs;
  taskOverview: EditTaskOverviewFormInputs;
  taskQuestionsDefaultValue: EditTaskQuestionFormInputs | null;
  taskQuestions: EditTaskQuestionFormInputs | null;
  subjectData: SubjectOverviewResponse[];
  materialData: MaterialOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onNext: (values: EditTaskOverviewFormInputs) => void;
}

const EditTaskOverviewForm = forwardRef<
  FormRef<EditTaskOverviewFormInputs>,
  EditTaskOverviewFormProps
>(
  (
    {
      taskOverviewDefaultValue,
      taskOverview,
      taskQuestionsDefaultValue,
      taskQuestions,
      subjectData,
      materialData,
      taskTypeData,
      gradeData,
      onNext,
    },
    ref
  ) => {
    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
      resetField,
      reset,
    } = useForm<EditTaskOverviewFormInputs>({
      resolver: zodResolver(editTaskOverviewSchema),
      defaultValues: taskOverviewDefaultValue || editTaskOverviewDefaultValues,
    });

    const watchedValues = useWatch({ control });
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedSubjectId = useWatch({ control, name: "subjectId" });
    const [filtertedMaterials, setFiltertedMaterials] = useState<
      MaterialOverviewResponse[]
    >([]);
    const selectedTaskTypeId = useWatch({ control, name: "taskTypeId" });

    // Gunakan useMemo untuk nilai turunan
    const selectedTaskTypeHasDeadline = useMemo(() => {
      if (!selectedTaskTypeId) return undefined;
      const taskType = taskTypeData.find(
        (tt) => tt.taskTypeId === selectedTaskTypeId
      );

      if (taskType) {
        resetField("startDate");
        resetField("startTime");
        resetField("endDate");
        resetField("endTime");
      }

      return taskType?.hasDeadline;
    }, [selectedTaskTypeId, taskTypeData]);

    // Prepare options for select fields
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
        filtertedMaterials.map((material) => ({
          value: material.materialId,
          label: material.name,
        })),
      [filtertedMaterials]
    );

    const taskTypeOptions = useMemo(
      () =>
        taskTypeData.map((taskType) => ({
          value: taskType.taskTypeId,
          label: taskType.name,
        })),
      [taskTypeData]
    );

    const gradeOptions = useMemo(
      () =>
        gradeData.map((grade) => ({
          value: grade.gradeId,
          label: grade.name,
        })),
      [gradeData]
    );

    useInitializeForm<EditTaskOverviewFormInputs>(reset, taskOverview, (d) => ({
      ...d,
      updatedBy: auth.getCachedUserProfile()?.name,
    }));
    useInitializeFileList(taskOverview, setFileList);

    const isDirty = useMemo(() => {
      const wv = JSON.stringify(watchedValues);
      const todv = JSON.stringify({
        ...taskOverviewDefaultValue,
        updatedBy: auth.getCachedUserProfile()?.name,
      });

      const isTaskOverviewFormDirty = wv !== todv;

      const isTaskQuestionsFormDirty = !isEqual(
        taskQuestions,
        taskQuestionsDefaultValue
      );

      return isTaskOverviewFormDirty || isTaskQuestionsFormDirty;
    }, [
      watchedValues,
      taskOverviewDefaultValue,
      taskQuestionsDefaultValue,
      taskQuestions,
    ]);

    useNavigationGuard(isDirty);
    useInitializeMaterialBasedOnSelectedSubject(
      selectedSubjectId,
      subjectData,
      materialData,
      resetField,
      setFiltertedMaterials
    );
    useInitializeFileListBetweenView(taskOverview, fileList, setFileList);

    // Handler untuk perubahan upload
    const handleImageChange = (info: any) => {
      let fileList = [...info.fileList];

      // Hanya izinkan satu file
      fileList = fileList.slice(-1);

      // Update fileList state
      setFileList(fileList);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Set nilai imageFile ke form
        setValue("imageFile", fileList[0].originFileObj as File, {
          shouldDirty: true,
        });
      } else {
        // Jika tidak ada file, set ke null
        setValue("imageFile", null, { shouldDirty: true });
      }
    };

    const onSubmit = async (data: EditTaskOverviewFormInputs) => {
      setIsLoading(true);

      let startTime = undefined;
      let endTime = undefined;

      if (data.startDate && data.startTime && data.endDate && data.endTime) {
        startTime = combineDateTime(data.startDate, data.startTime);
        endTime = combineDateTime(data.endDate, data.endTime);
      }

      const payload = {
        ...data,
        startTime,
        endTime,
      };

      onNext(payload);

      setIsLoading(false);
    };

    // Expose ke parent
    useImperativeHandle(ref, () => ({
      values: watchedValues,
      isDirty,
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="edit-task-overview-form"
          name="edit-task-overview"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          requiredMark={false}
        >
          <FormLayout
            left={
              <>
                <TextField
                  control={control}
                  name="title"
                  label="Judul"
                  placeholder="Masukkan judul tugas"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi tugas"
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
                  required
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
                  required
                />

                <SelectField
                  control={control}
                  name="gradeIds"
                  label="Tingkat Kelas"
                  placeholder="Pilih tingkat kelas"
                  options={gradeOptions}
                  errors={errors}
                  loading={gradeOptions.length === 0}
                  disabled={gradeOptions.length === 0}
                  mode="multiple"
                />

                {selectedTaskTypeHasDeadline && (
                  <>
                    <div className="w-full flex flex-col gap-2 mb-0">
                      <p className="text-base font-medium">Waktu Mulai</p>
                      <div className="w-full flex flex-row items-center gap-8">
                        <div className="flex-1">
                          <DateField
                            control={control}
                            name="startDate"
                            label="Tanggal"
                            placeholder="Masukkan tanggal"
                            errors={errors}
                          />
                        </div>
                        <div className="flex-1">
                          <TimeField
                            control={control}
                            name="startTime"
                            label="Jam"
                            placeholder="Masukkan jam"
                            errors={errors}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-2 mb-0">
                      <p className="text-base font-medium">Waktu Selesai</p>
                      <div className="w-full flex flex-row items-center gap-8">
                        <div className="flex-1">
                          <DateField
                            control={control}
                            name="endDate"
                            label="Tanggal"
                            placeholder="Masukkan tanggal"
                            errors={errors}
                          />
                        </div>
                        <div className="flex-1">
                          <TimeField
                            control={control}
                            name="endTime"
                            label="Jam"
                            placeholder="Masukkan jam"
                            errors={errors}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            }
            right={
              <ImageField
                control={control}
                name="imageFile"
                label="Upload Gambar"
                fileList={fileList}
                setFileList={setFileList}
                onChange={handleImageChange}
                errors={errors}
                mode="file"
              />
            }
            bottom={
              <>
                <p className="text-sm mb-4">
                  Jika semua data sudah sesuai, yuk lanjut buat pertanyaannya!
                </p>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  variant="primary"
                  className="!px-4"
                >
                  <span className="text-base font-semibold">
                    Lanjut Buat Soal
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                </Button>
              </>
            }
          />
        </Form>
      </>
    );
  }
);

EditTaskOverviewForm.displayName = "EditTaskOverviewForm";
export default EditTaskOverviewForm;
