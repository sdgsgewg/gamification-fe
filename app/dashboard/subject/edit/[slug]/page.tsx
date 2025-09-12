"use client";

import React, { useEffect, useState } from "react";
import EditSubjectForm, {
  EditSubjectFormInputs,
} from "@/app/components/forms/subjects/edit-subject-form";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { message } from "antd";
import { Toaster } from "@/app/hooks/use-toast";
import { Subject } from "@/app/interface/subjects/ISubject";
import Loading from "@/app/components/shared/Loading";

const EditSubjectPage = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectData, setSubjectData] = useState<Subject | null>(null);

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
        updatedBy: "", // akan diisi otomatis dari useEffect di form
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

  const handleEditSubjectSuccess = (values: EditSubjectFormInputs) => {
    console.log("Edit subject successful with:", values);
    router.push("/dashboard/subject");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Edit Mata Pelajaran" showBackButton={true} />
      {subjectData && (
        <EditSubjectForm
          onFinish={handleEditSubjectSuccess}
          defaultValues={subjectData}
        />
      )}
    </>
  );
};

export default EditSubjectPage;
