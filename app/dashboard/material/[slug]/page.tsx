"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { message } from "antd";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { MaterialDetailResponse } from "@/app/interface/materials/responses/IMaterialDetailResponse";
import Loading from "@/app/components/shared/Loading";
import { materialProvider } from "@/app/functions/MaterialProvider";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import Image from "next/image";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  GradeRow,
  SubjectRow,
} from "@/app/components/shared/table/detail-page/TableRowData";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";

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

  const fetchMaterialDetail = async () => {
    setIsLoading(true);

    try {
      const res = await materialProvider.getMaterial(params.slug);
      if (res.isSuccess && res.data) {
        const m = res.data;
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
        message.error("Gagal memuat detail materi");
        router.push("/dashboard/material");
      }
    } catch (error) {
      console.error("Failed to fetch material details: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchMaterialDetail();
    }
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

  if (isLoading || !materialData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    return (
      <div className="flex flex-col gap-4 text-black">
        <h2 className="text-2xl font-semibold">{materialData.name}</h2>
        <Image
          src={materialData.image ?? ""}
          alt={materialData.name}
          width={200}
          height={200}
        />
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-row items-center gap-2">
            <Image
              src={"/img/description.png"}
              alt="description"
              width={24}
              height={24}
            />
            <p className="text-base font-medium">Deskripsi</p>
          </div>
          <p className="text-sm text-justify">{materialData.description}</p>
        </div>
      </div>
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
