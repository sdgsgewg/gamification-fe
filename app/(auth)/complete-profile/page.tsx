"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CompleteProfileForm, {
  CompleteProfileFormInputs,
} from "@/app/components/forms/auth/complete-profile-form";
import FormLayout from "../form-layout";
import ShowInformationSection from "@/app/components/pages/Auth/ShowInformationSection";

type ViewState = "form" | "success" | "error";

const CompleteProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [view, setView] = useState<ViewState>("form");

  useEffect(() => {
    if (!uid) setView("error");
  }, [uid]);

  const handleCompleteProfileSuccess = (values: CompleteProfileFormInputs) => {
    console.log("Complete profile successful with:", values);
    setView("success");
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
  };

  const handleGoToGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const FormView = () => (
    <FormLayout>
      <CompleteProfileForm
        onFinish={handleCompleteProfileSuccess}
        uid={uid ?? ""}
      />
    </FormLayout>
  );

  const SuccessView = () => (
    <ShowInformationSection
      imageUrl="/img/success-solid-icon.png"
      imageAlt="Sukses"
      title="Pendaftaran Berhasil"
      subtitle1="Akun Anda telah berhasil dibuat."
      onButtonClick={handleNavigateToLogin}
      buttonText="Login Sekarang"
    />
  );

  const ErrorView = () => (
    <ShowInformationSection
      imageUrl="/img/error-regular-icon.png"
      imageAlt="Error"
      title="Terjadi Kesalahan"
      subtitle1="User ID tidak ditemukan."
      subtitle2="Silakan verifikasi ulang email Anda melalui tautan yang dikirim ke email Anda"
      onButtonClick={handleGoToGmail}
      buttonText="Verifikasi Email"
    />
  );

  return (
    <>
      {view === "form" ? (
        <FormView />
      ) : view === "success" ? (
        <SuccessView />
      ) : (
        <ErrorView />
      )}
    </>
  );
};

export default CompleteProfilePage;
