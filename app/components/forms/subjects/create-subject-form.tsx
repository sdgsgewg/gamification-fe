"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";
import {
  createSubjectDefaultValues,
  CreateSubjectFormInputs,
  createSubjectSchema,
} from "@/app/schemas/subjects/createSubject";
import { useInjectUser } from "@/app/hooks/form/useInjectUser";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { formText } from "@/app/utils/formText";

interface CreateSubjectFormProps {
  onFinish: (values: CreateSubjectFormInputs) => void;
}

const CreateSubjectForm = forwardRef<FormRef, CreateSubjectFormProps>(
  ({ onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
      setValue,
    } = useForm<CreateSubjectFormInputs>({
      resolver: zodResolver(createSubjectSchema),
      defaultValues: createSubjectDefaultValues,
    });

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useInjectUser(setValue, ["createdBy"]);
    const isDirty = Object.keys(dirtyFields).some(
      (field) => field !== "createdBy"
    );
    useNavigationGuard(isDirty);

    const onSubmit = async (data: CreateSubjectFormInputs) => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append image file
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await subjectProvider.createSubject(formData);
      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Subject created successfully!");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Failed to create subject.");
      }

      setIsLoading(false);
    };

    // Expose to parent
    useImperativeHandle(ref, () => ({
      isDirty,
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="create-subject-form"
          name="create-subject"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          requiredMark={false}
        >
          <FormLayout
            left={
              <>
                <TextField
                  control={control}
                  name="name"
                  {...formText("subject", "name")}
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  {...formText("subject", "description")}
                  errors={errors}
                />
              </>
            }
            right={
              <ImageField
                control={control}
                name="imageFile"
                {...formText("subject", "imageFile")}
                fileList={fileList}
                setFileList={setFileList}
                errors={errors}
                mode="file"
              />
            }
            bottom={
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                variant="primary"
                className="!px-8"
              >
                Submit
              </Button>
            }
          />
        </Form>
      </>
    );
  }
);

CreateSubjectForm.displayName = "CreateSubjectForm";
export default CreateSubjectForm;
