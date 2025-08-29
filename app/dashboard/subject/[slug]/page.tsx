"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { message, Modal } from "antd";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { Subject } from "@/app/interface/subjects/ISubject";
import ViewSubjectForm from "@/app/components/forms/subjects/view-subject-form";
import Loading from "@/app/components/shared/Loading";

const SubjectDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [subjectData, setSubjectData] = useState<Subject | null>(null);
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
    if (res.ok && res.data) {
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

  useEffect(() => {
    if (params.slug) {
      fetchSubjectDetail();
    }
  }, [params.slug]);

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
      if (res.ok) {
        toast.success("Mata pelajaran berhasil dihapus");
        router.push("/dashboard/subject");
      } else {
        toast.error(res.error || "Gagal menghapus mata pelajaran");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus");
      }
    }
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
      {subjectData && <ViewSubjectForm defaultValues={subjectData} />}

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
