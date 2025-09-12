"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { message, Modal } from "antd";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { Subject } from "@/app/interface/subjects/ISubject";
import Loading from "@/app/components/shared/Loading";
import Image from "next/image";
import {
  DetailPageTableContent,
  DetailPageTableHeader,
} from "@/app/components/pages/Dashboard/DetailPageTable";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { Material } from "@/app/interface/materials/IMaterial";
import { ColumnType } from "antd/es/table";
import DataTable from "@/app/components/shared/table/Table";

const SubjectDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [subjectData, setSubjectData] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchSubjectDetail = async () => {
    setIsLoading(true);
    const res = await subjectProvider.getSubject(params.slug);
    if (res.isSuccess && res.data) {
      const s = res.data;
      setSubjectData({
        subjectId: s.subjectId,
        name: s.name,
        slug: s.slug || "",
        description: s.description || "",
        image: s.image || "",
      });
    } else {
      message.error("Gagal memuat detail mata pelajaran");
      router.push("/dashboard/subject");
    }
    setIsLoading(false);
  };

  const fetchMaterials = async (searchText?: string) => {
    setIsLoading(true);
    const res = await materialProvider.getMaterials({ searchText });

    if (res.isSuccess && res.data) {
      setMaterials(
        res.data.map((m: Material, idx: number) => ({
          key: m.materialId ?? idx,
          ...m,
        }))
      );
    } else {
      message.error("Gagal memuat materi");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (params.slug) {
      fetchSubjectDetail();
    }
  }, [params.slug]);

  useEffect(() => {
    if (subjectData) {
      fetchMaterials(subjectData.name);
    }
  }, [subjectData]);

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/subject/edit/${slug}`);
  };

  const showDeleteModal = (subjectId: string) => {
    setDeleteSubjectId(subjectId);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteSubject = () => {
    if (deleteSubjectId !== null) {
      handleDelete(deleteSubjectId);
      setDeleteSubjectId(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteSubjectId(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await subjectProvider.deleteSubject(id);
      if (res.isSuccess) {
        toast.success("Mata pelajaran berhasil dihapus");
        router.push("/dashboard/subject");
      } else {
        toast.error(res.message || "Gagal menghapus mata pelajaran");
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
        <h2 className="text-2xl font-semibold">{subjectData?.name}</h2>
        <Image
          src={subjectData?.image ?? ""}
          alt={subjectData?.name ?? "Subject"}
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
          <p className="text-sm text-justify">{subjectData?.description}</p>
        </div>
      </div>
    );
  };

  const RightSideContent = () => {
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 5,
    });

    // Kolom tabel
    const columns: ColumnType<Material>[] = [
      {
        title: "No",
        key: "index",
        width: 50,
        align: "center",
        fixed: "left",
        render: (_: unknown, __: Material, index: number) =>
          (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        title: "Nama",
        dataIndex: "name",
        key: "name",
        width: 250,
        onCell: () => ({
          style: { minWidth: 250 },
        }),
      },
      {
        title: "Kelas",
        key: "grade",
        width: 200,
        render: (_, record) => record.grade || "-",
        onCell: () => ({
          style: { minWidth: 200 },
        }),
      },
    ];

    return (
      <>
        {/* Informasi Detail */}
        <div className="rounded-md border border-[#BCB4FF] overflow-hidden">
          {/* Header */}
          <DetailPageTableHeader
            imageSrc="/img/detail-information.png"
            imageAlt="Detail Information"
            label="Informasi Detail"
          />

          {/* Isi */}
          <DetailPageTableContent
            imageSrc="/img/material.png"
            imageAlt="Jumlah Materi"
            label="Jumlah Materi"
            value={materials?.length.toString() || ""}
          />
        </div>

        {/* Daftar Materi */}
        {materials && materials.length > 0 && (
          <DataTable
            columns={columns}
            data={materials}
            rowKey="key"
            title="Daftar Materi"
            loading={isLoading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
          />
        )}
      </>
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
        onEdit={() => handleEdit(subjectData?.slug || "")}
        onDelete={() => showDeleteModal(subjectData?.subjectId || "")}
      />
      {subjectData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
        />
      )}

      <Modal
        title="Konfirmasi Penghapusan"
        visible={isDeleteConfirmationModalVisible}
        onOk={confirmDeleteSubject}
        onCancel={cancelDelete}
        okText="Iya"
        cancelText="Tidak"
        okButtonProps={{ danger: true }}
      >
        <p>Apakah kamu yakin ingin menghapus mata pelajaran ini?</p>
      </Modal>
    </>
  );
};

export default SubjectDetailPage;
