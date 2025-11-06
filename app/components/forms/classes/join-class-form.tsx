"use client";

import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "../../fields/SelectField";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { joinClassDefaultValues, JoinClassFormInputs, joinClassSchema } from "@/app/schemas/classes/joinClass";

interface JoinClassFormProps {
  classData: ClassOverviewResponse[];
  onFinish: (values: JoinClassFormInputs) => void;
}

const JoinClassForm = forwardRef<FormRef, JoinClassFormProps>(
  ({ classData, onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<JoinClassFormInputs>({
      resolver: zodResolver(joinClassSchema),
      defaultValues: joinClassDefaultValues,
    });

    const classOptions = useMemo(
      () =>
        classData.map((c) => ({
          value: c.id,
          label: c.name,
        })),
      [classData]
    );

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    return (
      <Form
        id="join-class-form"
        name="join-class"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <SelectField
          control={control}
          name="classIds"
          label="Kelas"
          placeholder="Pilih kelas"
          options={classOptions}
          loading={classOptions.length === 0}
          disabled={classOptions.length === 0}
          mode="multiple"
        />
      </Form>
    );
  }
);

JoinClassForm.displayName = "JoinClassForm";
export default JoinClassForm;
