"use client";

import React, { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import Loading from "@/app/components/shared/Loading";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { ROUTES } from "@/app/constants/routes";
import { useUserDetail } from "@/app/hooks/users/useUserDetail";
import EditUserForm from "@/app/components/forms/users/edit-user-form";
import PageLayout from "@/app/(root)/page-layout";
import Button from "@/app/components/shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditProfilePage = () => {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.ROOT.PROFILE;

  const { data: userData, isLoading } = useUserDetail(params.username, "edit");
  const [backConfirmationModal, setBackConfirmationModal] = useState({
    visible: false,
    text: "",
  });

  const formRef = useRef<FormRef>(null);

  const handleBack = () => {
    const isDirty = formRef.current?.isDirty;

    if (!isDirty) {
      router.back();
      return;
    }

    setBackConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const handleBackConfirmation = () => {
    setBackConfirmationModal((prev) => ({ ...prev, visible: false }));
    router.back();
  };

  const handleEditUserSuccess = () => {
    router.push(`${baseRoute}/${params.username}`);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />

      <PageLayout>
        <>
          <div className="flex items-center justify-between pb-2 border-b border-b-dark mb-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <Button variant="primary" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                <span className="text-base font-semibold">Back</span>
              </Button>

              <div>
                <h1 className="text-3xl text-dark font-bold">{`Edit Profile`}</h1>
                <p className="text-tx-tertiary mt-2">{`Edit your profile with the most updated version of you`}</p>
              </div>
            </div>
          </div>

          {userData && (
            <EditUserForm
              ref={formRef}
              userData={userData}
              onFinish={handleEditUserSuccess}
            />
          )}
        </>
      </PageLayout>

      <ConfirmationModal
        visible={backConfirmationModal.visible}
        type="back"
        onConfirm={handleBackConfirmation}
        onCancel={() =>
          setBackConfirmationModal((prev) => ({ ...prev, visible: false }))
        }
      />
    </>
  );
};

export default EditProfilePage;
