"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { MaterialDetailResponse } from "@/app/interface/materials/responses/IMaterialDetailResponse";
import Loading from "@/app/components/shared/Loading";
import { materialProvider } from "@/app/functions/MaterialProvider";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  GradeRow,
  SubjectRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import DetailPageLeftSideContent from "@/app/components/pages/Dashboard/DetailPageLeftSideContent";

const MaterialDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [materialData, setMaterialData] =
    useState<MaterialDetailResponse | null>(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!params.slug) return;

    const fetchMaterialDetail = async () => {
      setIsLoading(true);

      const res = await materialProvider.getMaterial(params.slug);

      const { isSuccess, message, data } = res;

      if (isSuccess && data) {
        const m = data;
        setMaterialData({
          materialId: m.materialId,
          name: m.name,
          slug: m.slug,
          description: m.description ?? "",
          image: m.image ?? "",
          subject: m.subject ?? { subjectId: "", name: "" },
          materialGradeIds: m.materialGradeIds ?? [],
          materialGrade: m.materialGrade ?? "-",
          createdBy: m.createdBy,
          updatedBy: m.updatedBy ?? "-",
        });
      } else {
        console.error(message ?? "Gagal memuat detail materi");
        router.push("/dashboard/material");
      }

      setIsLoading(false);
    };

    fetchMaterialDetail();
  }, [params.slug]);

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/material/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteMaterialId(materialId);
    setDeleteMaterialName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteMaterial = () => {
    if (deleteMaterialId !== null) {
      handleDelete(deleteMaterialId);
      setDeleteMaterialId(null);
      setDeleteMaterialName(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteMaterialId(null);
    setDeleteMaterialName(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await materialProvider.deleteMaterial(id);
      if (res.isSuccess) {
        toast.success("Materi pelajaran berhasil dihapus");
        router.push("/dashboard/material");
      } else {
        toast.error(res.message ?? "Gagal menghapus materi pelajaran");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus materi pelajaran");
      }
    }
  };

  if (!materialData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { name, image, description } = materialData;

    return (
      <DetailPageLeftSideContent
        name={name}
        image={image}
        description={description}
      />
    );
  };

  const RightSideContent = () => {
    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <SubjectRow value={materialData.subject.name} />
          <GradeRow value={materialData.materialGrade ?? ""} />
        </DetailInformationTable>

        {/* Riwayat */}
        <HistoryTable
          createdBy={materialData.createdBy}
          updatedBy={materialData.updatedBy}
        />
      </>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        onEdit={() => {
          if (materialData) handleEdit(materialData.slug);
        }}
        onDelete={() => {
          if (materialData)
            showDeleteModal(materialData.materialId, materialData.name);
        }}
      />
      {materialData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
        />
      )}

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus materi pelajaran dengan nama '${deleteMaterialName}'?`}
        onConfirm={confirmDeleteMaterial}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MaterialDetailPage;
