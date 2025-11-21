"use client";

import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useAuth } from "@/app/hooks/auth/useAuth";
import TextField from "../../fields/TextField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import {
  editUserDefaultValues,
  EditUserFormInputs,
  editUserSchema,
} from "@/app/schemas/users/editUser";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useInitializeForm } from "@/app/hooks/form/useInitializeForm";
import { useInitializeFileList } from "@/app/hooks/file/useInitializeFileList";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";
import DateField from "../../fields/DateField";
import { Gender, GenderLabels } from "@/app/enums/Gender";
import { userProvider } from "@/app/functions/UserProvider";
import SelectField from "../../fields/SelectField";

interface EditUserFormProps {
  userData?: EditUserFormInputs;
  onFinish: (values: EditUserFormInputs) => void;
}

const EditUserForm = forwardRef<FormRef, EditUserFormProps>(
  ({ userData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
      setValue,
      reset,
    } = useForm<EditUserFormInputs>({
      resolver: zodResolver(editUserSchema),
      defaultValues: userData || editUserDefaultValues,
    });

    const { getCachedUserProfile } = useAuth();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Prepare options for select fields
    const genderOptions = Object.values(Gender).map((value) => ({
      value,
      label: GenderLabels[value],
    }));

    useInitializeForm<EditUserFormInputs>(reset, userData, (d) => ({
      ...d,
      updatedBy: getCachedUserProfile()?.name,
    }));
    useInitializeFileList(userData, setFileList);
    const isDirty = Object.keys(dirtyFields).some(
      (field) => field !== "updatedBy"
    );
    useNavigationGuard(isDirty);

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

    const onSubmit = async (data: EditUserFormInputs) => {
      if (!userData || !userData.userId) return;

      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append file images
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await userProvider.updateProfile(formData);

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Profile has been updated!");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Failed to update profile.");
      }

      setIsLoading(false);
    };

    // Expose ke parent
    useImperativeHandle(ref, () => ({
      isDirty,
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="edit-user-form"
          name="edit-user"
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
                  label="Nama"
                  placeholder="Enter name"
                  errors={errors}
                  required
                />

                <TextField
                  control={control}
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                  errors={errors}
                  required
                />

                <SelectField
                  control={control}
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  errors={errors}
                  loading={genderOptions.length === 0}
                  disabled={genderOptions.length === 0}
                />

                <TextField
                  control={control}
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  errors={errors}
                />

                <DateField
                  control={control}
                  name="dob"
                  label="Date of Birth"
                  placeholder="Enter date"
                  errors={errors}
                />
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

EditUserForm.displayName = "EditUserForm";
export default EditUserForm;
