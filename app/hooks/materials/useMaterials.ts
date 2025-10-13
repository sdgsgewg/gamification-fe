"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterMaterialFormInputs } from "@/app/schemas/materials/filterMaterial";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";

export const useMaterials = (values?: FilterMaterialFormInputs) => {
  return useQuery({
    queryKey: ["materials", values],
    queryFn: async () => {
      const res = await materialProvider.getMaterials(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: MaterialOverviewResponse[]) =>
      data.map((m, idx) => ({
        key: m.materialId ?? idx,
        ...m,
      })),
  });
};
