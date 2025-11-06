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
import { useAuth } from "@/app/hooks/useAuth";
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
import {
  TaskDifficulty,
  TaskDifficultyLabels,
} from "@/app/enums/TaskDifficulty";

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
    const { getCachedUserProfile } = useAuth();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedSubjectId = useWatch({ control, name: "subjectId" });
    const [filteredMaterials, setFilteredMaterials] = useState<
      MaterialOverviewResponse[]
    >([]);
    const selectedTaskTypeId = useWatch({ control, name: "taskTypeId" });

    // Use useMemo for derived values
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
        filteredMaterials.map((material) => ({
          value: material.materialId,
          label: material.name,
        })),
      [filteredMaterials]
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

    const difficultyOptions = Object.values(TaskDifficulty).map((value) => ({
      value,
      label: TaskDifficultyLabels[value],
    }));

    useInitializeForm<EditTaskOverviewFormInputs>(reset, taskOverview, (d) => ({
      ...d,
      updatedBy: getCachedUserProfile()?.name,
    }));
    useInitializeFileList(taskOverview, setFileList);

    // Detect if form data has been modified
    const isDirty = useMemo(() => {
      const currentValues = JSON.stringify(watchedValues);
      const originalValues = JSON.stringify({
        ...taskOverviewDefaultValue,
        updatedBy: getCachedUserProfile()?.name,
      });

      const isTaskOverviewDirty = currentValues !== originalValues;
      const isTaskQuestionsDirty = !isEqual(
        taskQuestions,
        taskQuestionsDefaultValue
      );

      return isTaskOverviewDirty || isTaskQuestionsDirty;
    }, [
      watchedValues,
      taskOverviewDefaultValue,
      taskQuestionsDefaultValue,
      taskQuestions,
      getCachedUserProfile,
    ]);

    useNavigationGuard(isDirty);

    useInitializeMaterialBasedOnSelectedSubject(
      selectedSubjectId,
      subjectData,
      materialData,
      resetField,
      setFilteredMaterials
    );
    useInitializeFileListBetweenView(taskOverview, fileList, setFileList);

    // Handle file upload changes
    const handleImageChange = (info: any) => {
      const newFileList = [...info.fileList].slice(-1); // only one image allowed
      setFileList(newFileList);

      if (newFileList.length > 0 && newFileList[0].originFileObj) {
        setValue("imageFile", newFileList[0].originFileObj as File, {
          shouldDirty: true,
        });
      } else {
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

    // Expose to parent
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
                  label="Title"
                  placeholder="Enter task title"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Enter task description"
                  errors={errors}
                />

                <SelectField
                  control={control}
                  name="subjectId"
                  label="Subject"
                  placeholder="Select subject"
                  options={subjectOptions}
                  errors={errors}
                  loading={subjectOptions.length === 0}
                  disabled={subjectOptions.length === 0}
                  required
                />

                <SelectField
                  control={control}
                  name="materialId"
                  label="Material"
                  placeholder="Select material"
                  options={materialOptions}
                  errors={errors}
                  disabled={materialOptions.length === 0}
                />

                <SelectField
                  control={control}
                  name="taskTypeId"
                  label="Task Type"
                  placeholder="Select task type"
                  options={taskTypeOptions}
                  errors={errors}
                  loading={taskTypeOptions.length === 0}
                  disabled={taskTypeOptions.length === 0}
                  required
                />

                <SelectField
                  control={control}
                  name="gradeIds"
                  label="Grade Levels"
                  placeholder="Select grade levels"
                  options={gradeOptions}
                  errors={errors}
                  loading={gradeOptions.length === 0}
                  disabled={gradeOptions.length === 0}
                  mode="multiple"
                />

                <SelectField
                  control={control}
                  name="difficulty"
                  label="Tingkat Kesulitan"
                  placeholder="Pilih tingkat kesulitan"
                  options={difficultyOptions}
                  errors={errors}
                  loading={difficultyOptions.length === 0}
                  disabled={difficultyOptions.length === 0}
                  required
                />

                {selectedTaskTypeHasDeadline && (
                  <>
                    <div className="w-full flex flex-col gap-2 mb-0">
                      <p className="text-base font-medium">Start Time</p>
                      <div className="w-full flex flex-row items-center gap-8">
                        <div className="flex-1">
                          <DateField
                            control={control}
                            name="startDate"
                            label="Date"
                            placeholder="Enter date"
                            errors={errors}
                          />
                        </div>
                        <div className="flex-1">
                          <TimeField
                            control={control}
                            name="startTime"
                            label="Time"
                            placeholder="Enter time"
                            errors={errors}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-2 mb-0">
                      <p className="text-base font-medium">End Time</p>
                      <div className="w-full flex flex-row items-center gap-8">
                        <div className="flex-1">
                          <DateField
                            control={control}
                            name="endDate"
                            label="Date"
                            placeholder="Enter date"
                            errors={errors}
                          />
                        </div>
                        <div className="flex-1">
                          <TimeField
                            control={control}
                            name="endTime"
                            label="Time"
                            placeholder="Enter time"
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
                label="Upload Image"
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
                  If all the data looks correct, let’s continue to update the
                  questions!
                </p>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  variant="primary"
                  className="!px-4"
                >
                  <span className="text-base font-semibold">
                    Continue to Edit Questions
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
