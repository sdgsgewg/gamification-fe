"use client";

import { Form, Input, Select } from "antd";
import { IdcardOutlined, UserOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Grade } from "@/app/interface/grades/IGrade";
import { getAxios } from "@/app/utils/AxiosFunction";
import { User } from "@/app/interface/users/IUser";
import { userProvider } from "@/app/functions/UserProvider";
import { auth } from "@/app/functions/AuthProvider";
import Button from "../../shared/Button";
import SelectField from "../../fields/SelectField";
import { gradeProvider } from "@/app/functions/GradeProvider";

// --- Zod Schema ---
const completeProfileSchema = z
  .object({
    name: z.string().nonempty("Nama wajib diisi"),
    username: z
      .string()
      .nonempty("Username wajib diisi")
      .min(8, "Username harus terdiri dari minimal 8 karakter")
      .regex(
        /^(?=.*[0-9])[a-zA-Z0-9._]+$/,
        "Username harus terdiri dari huruf atau angka."
      ),
    gradeId: z.string().optional(),
    role: z.enum(["guest", "student", "teacher", "admin"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === "student" &&
      (!data.gradeId || data.gradeId.trim() === "")
    ) {
      ctx.addIssue({
        path: ["gradeId"],
        code: "custom",
        message: "Tingkatan kelas wajib dipilih untuk siswa",
      });
    }
  });

export type CompleteProfileFormInputs = z.infer<typeof completeProfileSchema>;

interface CompleteProfileFormProps {
  onFinish: (values: CompleteProfileFormInputs) => void;
  uid: string;
}

export default function CompleteProfileForm({
  onFinish,
  uid,
}: CompleteProfileFormProps) {
  const { toast } = useToast();

  const [user, setUser] = useState<User>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompleteProfileFormInputs>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      gradeId: "",
      role: user?.role || "student",
    },
  });

  const [grades, setGrades] = useState<Grade[]>([]);

  const onSubmit = async (data: CompleteProfileFormInputs) => {
    const result = await auth.completeProfile(data, uid);
    console.log("Result: ", result);
    if (result.ok) {
      toast.success("Complete profile successful!");
      onFinish(data);
    } else {
      toast.error(result.error || "Complete profile failed.");
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await gradeProvider.getGrades();
        if (res.isSuccess && res.data) setGrades(res.data);
      } catch (error) {
        console.error("Failed to fetch grades: ", error);
      }
    };

    fetchGrades();
  }, []);

  useEffect(() => {
    const getUserDetail = async () => {
      if (!uid) return;
      const result = await userProvider.getUserDetail(uid);
      if (result && result.ok) {
        setUser(result.user);
      } else {
        console.error("Failed to fetch user detail:", result.error);
      }
    };

    getUserDetail();
  }, [uid]);

  useEffect(() => {
    if (user) {
      const roleForForm = ["student", "teacher", "admin"].includes(user.role)
        ? user.role
        : "student";
      setValue("role", roleForForm, { shouldValidate: true });
    }
  }, [user]);

  return (
    <Form
      name="completeProfile"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Informasi Pribadi</h1>
          <p className="text-base font-medium">
            Mohon isi data di bawah ini agar kami dapat lebih memahami
            preferensimu.
          </p>
        </div>

        {/* Name Field */}
        <Form.Item
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          style={{ marginBottom: errors.name ? "2.5rem" : "2rem" }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined style={{ marginRight: 8 }} />}
                placeholder="Name"
                size="large"
              />
            )}
          />
        </Form.Item>

        {/* Username Field */}
        <Form.Item
          validateStatus={errors.username ? "error" : ""}
          help={errors.username?.message}
          style={{ marginBottom: errors.username ? "2.5rem" : "2rem" }}
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<IdcardOutlined style={{ marginRight: 8 }} />}
                placeholder="Username"
                size="large"
              />
            )}
          />
        </Form.Item>

        {/* Grade Select Field */}
        {user?.role === "student" && (
          // <Form.Item
          //   label={
          //     <span className="font-medium">Kelas Berapa Kamu Saat Ini?</span>
          //   }
          //   validateStatus={errors.gradeId ? "error" : ""}
          //   help={errors.gradeId?.message}
          //   style={{ marginBottom: errors.gradeId ? "2.5rem" : "2rem" }}
          // >
          //   <Controller
          //     name="gradeId"
          //     control={control}
          //     render={({ field }) => (
          //       <Select
          //         {...field}
          //         placeholder="Pilih Kelas"
          //         size="large"
          //         loading={grades.length === 0}
          //         disabled={grades.length === 0}
          //         value={field.value || undefined}
          //         options={grades.map((grade) => ({
          //           value: grade.gradeId,
          //           label: grade.name,
          //         }))}
          //       />
          //     )}
          //   />
          // </Form.Item>

          <SelectField
            name="gradeId"
            control={control}
            label="Kelas Berapa Kamu Saat Ini?"
            placeholder="Pilih Kelas"
            options={grades.map((grade) => ({
              value: grade.gradeId,
              label: grade.name,
            }))}
            errors={errors.gradeId}
            loading={grades.length === 0}
            disabled={grades.length === 0}
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
      </div>
    </Form>
  );
}
