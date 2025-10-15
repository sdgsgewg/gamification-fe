"use client";

import React, { useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  GradeRow,
  SubjectRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { useDeleteMaterial } from "@/app/hooks/materials/useDeleteMaterial";
import { useMaterialDetail } from "@/app/hooks/materials/useMaterialDetail";

const MaterialDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS;

  const { data: materialData, isLoading } = useMaterialDetail(
    params.slug,
    "detail"
  );
  const { mutateAsync: deleteMaterial } = useDeleteMaterial();

  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteMaterialId(materialId);
    setDeleteMaterialName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDelete = () => {
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
    const res = await deleteMaterial(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Materi berhasil dihapus");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Gagal menghapus materi pelajaran");
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
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MaterialDetailPage;
