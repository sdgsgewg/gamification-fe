"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { message, Modal } from "antd";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { Material } from "@/app/interface/materials/IMaterial";
import Loading from "@/app/components/shared/Loading";
import { materialProvider } from "@/app/functions/MaterialProvider";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import Image from "next/image";
import {
  DetailPageTableContent,
  DetailPageTableHeader,
} from "@/app/components/pages/Dashboard/DetailPageTable";

const MaterialDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [materialData, setMaterialData] = useState<Material | null>(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
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
          slug: m.slug || "",
          description: m.description || "",
          image: m.image || "",
          subject: m.subject || { subjectId: "", name: "" },
          gradeIds: m.gradeIds || [],
          grade: m.grade || "",
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

  const showDeleteModal = (materialId: string) => {
    setDeleteMaterialId(materialId);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteMaterial = () => {
    if (deleteMaterialId !== null) {
      handleDelete(deleteMaterialId);
      setDeleteMaterialId(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteMaterialId(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await materialProvider.deleteMaterial(id);
      if (res.isSuccess) {
        toast.success("Materi berhasil dihapus");
        router.push("/dashboard/material");
      } else {
        toast.error(res.message || "Gagal menghapus materi");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus");
      }
    }
  };

  const LeftSideContent = () => {
    return (
      <div className="flex flex-col gap-4 text-black">
        <h2 className="text-2xl font-semibold">{materialData?.name}</h2>
        <Image
          src={materialData?.image ?? ""}
          alt={materialData?.name ?? "Material"}
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
          <p className="text-sm text-justify">{materialData?.description}</p>
        </div>
      </div>
    );
  };

  const RightSideContent = () => {
    return (
      <div className="rounded-md border border-[#BCB4FF] overflow-hidden">
        {/* Header */}
        <DetailPageTableHeader
          imageSrc="/img/detail-information.png"
          imageAlt="Detail Information"
          label="Informasi Detail"
        />

        {/* Isi */}
        <DetailPageTableContent
          imageSrc="/img/subject.png"
          imageAlt="Mata Pelajaran"
          label="Mata Pelajaran"
          value={materialData?.subject?.name || ""}
        />
        <DetailPageTableContent
          imageSrc="/img/class.png"
          imageAlt="Tingkatan Kelas"
          label="Ditujukan Untuk Kelas"
          value={materialData?.grade || ""}
        />
      </div>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        onEdit={() => handleEdit(materialData?.slug || "")}
        onDelete={() => showDeleteModal(materialData?.materialId || "")}
      />
      {materialData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
        />
      )}

      <Modal
        title="Konfirmasi Penghapusan"
        visible={isDeleteConfirmationModalVisible}
        onOk={confirmDeleteMaterial}
        onCancel={cancelDelete}
        okText="Iya"
        cancelText="Tidak"
        okButtonProps={{ danger: true }}
      >
        <p>Apakah kamu yakin ingin menghapus materi ini?</p>
      </Modal>
    </>
  );
};

export default MaterialDetailPage;
