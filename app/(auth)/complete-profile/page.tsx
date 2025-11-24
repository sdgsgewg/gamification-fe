"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/app/components/forms/auth/complete-profile-form";
import ShowInformationSection from "@/app/components/pages/Auth/ShowInformationSection";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { userProvider } from "@/app/functions/UserProvider";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import Loading from "@/app/components/shared/Loading";

export const dynamic = "force-dynamic";

type ViewState = "form" | "success" | "error";

const CompleteProfilePageContent = () => {
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

  const handleCompleteProfileSuccess = () => {
    setView("success");
  };

  const handleNavigateToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
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
      imageUrl={IMAGES.SUCCESS_SOLID_ICON}
      imageAlt="Success"
      title="Registration Successful"
      subtitle1="Your account has been successfully created."
      onButtonClick={handleNavigateToLogin}
      buttonText="Login Now"
    />
  );

  const ErrorView = () => (
    <ShowInformationSection
      imageUrl={IMAGES.ERROR_REGULAR_ICON}
      imageAlt="Error"
      title="An Error Occurred"
      subtitle1="User ID not found."
      subtitle2="Please verify your email again using the link sent to your email."
      onButtonClick={handleGoToGmail}
      buttonText="Verify Email"
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

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompleteProfilePageContent />
    </Suspense>
  );
}
