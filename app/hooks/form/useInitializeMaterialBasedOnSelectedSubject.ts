import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { useEffect } from "react";

/**
 * Reset opsi material field berdasarkan subject yang dipilih
 */
export function useInitializeMaterialBasedOnSelectedSubject(
  selectedSubjectId: string | undefined,
  subjectData: SubjectOverviewResponse[],
  materialData: MaterialOverviewResponse[],
  resetField: any,
  setFiltertedMaterials: React.Dispatch<
    React.SetStateAction<MaterialOverviewResponse[]>
  >
) {
  useEffect(() => {
    if (selectedSubjectId) {
      const subject = subjectData.find(
        (s) => s.subjectId === selectedSubjectId
      );
      if (subject) {
        resetField("materialId");

        const filteredMaterials = materialData.filter(
          (m) => m.subject === subject.name
        );
        setFiltertedMaterials(filteredMaterials);
      }
    }
  }, [selectedSubjectId, subjectData, materialData, resetField]);
}
