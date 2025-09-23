"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompleteProfileFormInputs } from "@/app/schemas/auth/completeProfile";
import CompleteProfileForm from "@/app/components/forms/auth/complete-profile-form";
import ShowInformationSection from "@/app/components/pages/Auth/ShowInformationSection";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { userProvider } from "@/app/functions/UserProvider";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";

type ViewState = "form" | "success" | "error";

const CompleteProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [userData, setUserData] = useState<UserDetailResponse | null>(null);
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [view, setView] = useState<ViewState>("form");

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!uid) return;
      const result = await userProvider.getUserById(uid);

      const { isSuccess, message, data } = result;

      if (isSuccess && data) {
        setUserData(data);
      } else {
        console.error("Failed to fetch user detail:", message);
      }
    };

    fetchUserDetail();
  }, [uid]);

  useEffect(() => {
    const fetchGrades = async () => {
      const result = await gradeProvider.getGrades();

      const { isSuccess, message, data } = result;

      if (isSuccess && data) {
        setGradeData(data);
      } else {
        console.error("Failed to fetch grades: ", message);
      }
    };

    fetchGrades();
  }, []);

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
    <CompleteProfileForm
      userData={userData}
      gradeData={gradeData}
      onFinish={handleCompleteProfileSuccess}
    />
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
