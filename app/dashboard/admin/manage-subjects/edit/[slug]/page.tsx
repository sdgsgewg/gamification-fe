"use client";

import React, { useEffect, useRef, useState } from "react";
import EditSubjectForm from "@/app/components/forms/subjects/edit-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { EditSubjectFormInputs } from "@/app/schemas/subjects/editSubject";
import { BackConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { getImageSrc } from "@/app/utils/image";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";

const EditSubjectPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;
  const params = useParams<{ slug: string }>();
  const [subjectData, setSubjectData] = useState<EditSubjectFormInputs | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isBackConfirmationModalVisible, setIsBackConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const fetchSubjectDetail = async () => {
    setIsLoading(true);

    const res = await subjectProvider.getSubject(params.slug);

    const { isSuccess, message, data } = res;

    if (isSuccess && data) {
      const s = data;
      setSubjectData({
        subjectId: s.subjectId,
        name: s.name,
        description: s.description ?? "",
        updatedBy: "",
        image: s.image ? getImageSrc(s.image) : "",
        imageFile: null,
      });
    } else {
      console.error(message ?? "Gagal memuat detail mata pelajaran");
      router.push(`${baseRoute}`);
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    if (!isDirty) {
      router.back();
      return;
    }

    setIsBackConfirmationModalVisible(true);
  };

  const handleBackConfirmation = () => {
    setIsBackConfirmationModalVisible(false);
    router.back();
  };

  const handleEditSubjectSuccess = (values: EditSubjectFormInputs) => {
    console.log("Edit subject successful with:", values);
    router.push(`${baseRoute}`);
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
          subjectData={subjectData}
          onFinish={handleEditSubjectSuccess}
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
