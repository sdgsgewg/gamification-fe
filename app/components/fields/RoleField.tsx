"use client";

import { Form, Radio } from "antd";
import { Controller } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { RoleOverviewResponse } from "@/app/interface/roles/responses/IRoleOverviewResponse";
import { Role, RoleLabels } from "@/app/enums/Role";

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
      label={<span className="font-medium">Anda membuat akun sebagai?</span>}
      validateStatus={errors.roleId ? "error" : ""}
      help={errors.roleId?.message}
      style={{ marginBottom: errors.roleId ? "1rem" : "0rem" }}
    >
      <Controller
        name="roleId"
        control={control}
        rules={{ required: "Silakan pilih peran Anda!" }}
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
              // casting supaya bisa akses RoleLabels
              const roleKey = role.name as Role;
              const label = RoleLabels[roleKey] ?? role.name;

              return (
                <Radio
                  key={role.roleId}
                  value={role.roleId}
                  style={{
                    padding: "0.7rem 1rem",
                    color: field.value === role.roleId ? "#2563EB" : "#374151",
                    fontWeight: field.value === role.roleId ? "600" : "400",
                  }}
                  className={`w-1/2 border rounded-md ${
                    field.value === role.roleId
                      ? "border-blue-600"
                      : "border-gray-300"
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
