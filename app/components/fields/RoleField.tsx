"use client";

import { Form, Radio } from "antd";
import { Controller } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { RoleOverviewResponse } from "@/app/interface/roles/responses/IRoleOverviewResponse";
import { Role, RoleLabels } from "@/app/enums/Role";
import Label from "./Label";

interface RoleFieldProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  roleData: RoleOverviewResponse[];
}

export default function RoleField({
  control,
  errors,
  roleData,
}: RoleFieldProps) {
  return (
    <Form.Item
      label={<Label label="You are creating an account as?" />}
      validateStatus={errors.roleId ? "error" : ""}
      help={errors.roleId?.message}
      style={{ marginBottom: errors.roleId ? "1rem" : "0rem" }}
    >
      <Controller
        name="roleId"
        control={control}
        rules={{ required: "Please select your role!" }}
        render={({ field }) => (
          <Radio.Group
            {...field}
            size="large"
            style={{
              width: "100%",
              display: "flex",
              gap: "1rem",
            }}
          >
            {roleData.map((role) => {
              // Cast so we can access RoleLabels
              const roleKey = role.name as Role;
              const label = RoleLabels[roleKey] ?? role.name;

              return (
                <Radio
                  key={role.roleId}
                  value={role.roleId}
                  style={{
                    padding: "0.7rem 1rem",
                    color:
                      field.value === role.roleId
                        ? "var(--text-primary-accent)"
                        : "var(--text-secondary)",
                    fontWeight: field.value === role.roleId ? "600" : "400",
                  }}
                  className={`w-1/2 border rounded-md ${
                    field.value === role.roleId
                      ? "border-[var(--color-primary)]"
                      : "border-[var(--color-light-accent)]"
                  }`}
                >
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        )}
      />
    </Form.Item>
  );
}