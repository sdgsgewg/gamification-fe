"use client";

import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { Material } from "@/app/interface/materials/IMaterial";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { imageProvider } from "@/app/functions/ImageProvider";
import { materialProvider } from "@/app/functions/MaterialProvider";

const MaterialPage = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchMaterials = async (searchText?: string, subjectId?: string) => {
    setIsLoading(true);
    const res = await materialProvider.getMaterials({ searchText, subjectId });

    console.log("Data: ", JSON.stringify(res.data, null, 2));

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
    fetchMaterials();
  }, []);

  const handleNavigateToCreateMaterialPage = () => {
    router.push("/dashboard/material/create");
  };

  const handleView = (slug: string) => {
    router.push(`/dashboard/material/${slug}`);
  };

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
      // Ambil dulu detail materi sebelum delete, supaya tahu image URL-nya
      const material = materials.find((s) => s.materialId === id);

      const res = await materialProvider.deleteMaterial(id);
      if (res.isSuccess) {
        // kalau material punya image lama, hapus dari Supabase Storage
        if (material?.image) {
          await imageProvider.deleteImage(material.image, "materials");
        }

        toast.success("Materi berhasil dihapus");
        fetchMaterials();
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
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Mata Pelajaran",
      key: "subject",
      width: 300,
      render: (_, record) => record.subject?.name || "-",
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Kelas",
      key: "grade",
      width: 200,
      render: (_, record) => record.grade || "-",
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record.slug)}
          onEdit={() => handleEdit(record.slug)}
          onDelete={() => showDeleteModal(record.materialId)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Daftar Materi Pelajaran" showBackButton={false} />

      <Table
        columns={columns}
        data={materials}
        rowKey="key"
        loading={isLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onAddButtonClick={handleNavigateToCreateMaterialPage}
        searchable
        searchPlaceholder="Cari materi pelajaran…"
        onSearch={(value) => fetchMaterials(value)}
        onRefresh={() => fetchMaterials()}
      />

      <Modal
        title="Konfirmasi Penghapusan"
        visible={isDeleteConfirmationModalVisible}
        onOk={confirmDeleteMaterial}
        onCancel={cancelDelete}
        okText="Iya"
        cancelText="Tidak"
        okButtonProps={{ danger: true }}
      >
        <p>Apakah kamu yakin ingin menghapus materi pelajaran ini?</p>
      </Modal>
    </>
  );
};

export default MaterialPage;
