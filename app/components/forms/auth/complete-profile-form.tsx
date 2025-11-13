"use client";

import { useEffect, useState } from "react";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import {
  completeProfileDefaultValues,
  CompleteProfileFormInputs,
  completeProfileSchema,
} from "@/app/schemas/auth/completeProfile";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/hooks/useAuth";
import Loading from "../../shared/Loading";
import { Form } from "antd";
import FormLayout from "@/app/(auth)/form-layout";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { IdcardOutlined, UserOutlined } from "@ant-design/icons";
import Button from "../../shared/Button";
import FormTitle from "../../pages/Auth/FormTitle";

interface CompleteProfileFormProps {
  userData: UserDetailResponse | null;
  gradeData: GradeOverviewResponse[];
  onFinish: (values: CompleteProfileFormInputs) => void;
}

export default function CompleteProfileForm({
  userData,
  gradeData,
  onFinish,
}: CompleteProfileFormProps) {
  const { toast } = useToast();
  const { completeProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompleteProfileFormInputs>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: completeProfileDefaultValues,
  });

  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Prepare options for select fields
  const gradeOptions = gradeData.map((grade) => ({
    value: grade.gradeId,
    label: grade.name,
  }));

  useEffect(() => {
    if (!userData) return;

    setUserId(userData.userId);

    const role = userData.role.name.toLowerCase();

    setUserRole(role);
    setValue("role", role, { shouldValidate: true });
  }, [userData]);

  const onSubmit = async (data: CompleteProfileFormInputs) => {
    setIsLoading(true);

    const result = await completeProfile(userId, data);

    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(message ?? "Complete profile successful!");
      onFinish(data);
    } else {
      toast.error(message ?? "Complete profile failed.");
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Form
        name="completeProfile"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
      >
        <FormLayout
          top={
            <>
              <FormTitle
                title="Informasi Pribadi"
                subtitle="Mohon isi data di bawah ini agar kami dapat lebih memahami
                  preferensimu."
              />

              {/* Name Field */}
              <TextField
                control={control}
                name="name"
                placeholder="Masukkan nama"
                errors={errors}
                required
                prefixIcon={<UserOutlined style={{ marginRight: 8 }} />}
              />

              {/* Username Field */}
              <TextField
                control={control}
                name="username"
                placeholder="Masukkan username"
                errors={errors}
                required
                prefixIcon={<IdcardOutlined style={{ marginRight: 8 }} />}
              />

              {/* Grade Select Field */}
              {userRole === "student" && (
                <SelectField
                  name="gradeId"
                  control={control}
                  label="Kelas Berapa Kamu Saat Ini?"
                  placeholder="Pilih Kelas"
                  options={gradeOptions}
                  errors={errors.gradeId}
                  loading={gradeOptions.length === 0}
                  disabled={gradeOptions.length === 0}
                />
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  variant="primary"
                >
                  Submit
                </Button>
              </Form.Item>
            </>
          }
        />
      </Form>
    </>
  );
}
