"use client";

import React, { useEffect, useRef, useState } from "react";
import EditSubjectForm, {
  EditSubjectFormRef,
} from "@/app/components/forms/subjects/edit-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { message } from "antd";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { EditSubjectFormInputs } from "@/app/schemas/subjects/editSubject";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { removeItem } from "@/app/utils/storage";
import { getImageSrc } from "@/app/utils/image";

const EditSubjectPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<EditSubjectFormInputs | null>(
    null
  );
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<EditSubjectFormRef>(null);

  const fetchSubjectDetail = async () => {
    setIsLoading(true);
    const res = await subjectProvider.getSubject(params.slug);
    if (res.isSuccess && res.data) {
      const s = res.data;
      setSubjectData({
        subjectId: s.subjectId,
        name: s.name,
        description: s.description ?? "",
        updatedBy: "",
        image: s.image ? getImageSrc(s.image) : "",
        imageFile: null,
      });
    } else {
      message.error("Gagal memuat detail mata pelajaran");
      router.push("/dashboard/subject");
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    console.log("Is dirty status: ", isDirty);

    if (!isDirty) {
      router.push("/dashboard/subject");
      return;
    }

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    removeItem("subjectDraft");

    setIsBackConfirmationModalVisible(false);
    router.push("/dashboard/subject");
  };

  const handleEditSubjectSuccess = (values: EditSubjectFormInputs) => {
    console.log("Edit subject successful with:", values);
    router.push("/dashboard/subject");
  };

  useEffect(() => {
    if (params.slug) {
      fetchSubjectDetail();
    }
  }, [params.slug]);

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle title="Edit Mata Pelajaran" onBack={handleBack} />
      {subjectData && (
        <EditSubjectForm
          ref={formRef}
          onFinish={handleEditSubjectSuccess}
          subjectData={subjectData}
        />
      )}

      {isBackConfirmationModalVisible && (
        <BackConfirmationModal
          visible={isBackConfirmationModalVisible}
          onConfirm={handleBackConfirmation}
          onCancel={() => setIsBackConfirmationModalVisible(false)}
        />
      )}
    </>
  );
};

export default EditSubjectPage;
