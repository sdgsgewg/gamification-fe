"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShowInformationSection from "@/app/components/pages/Auth/ShowInformationSection";

import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { useAuth } from "@/app/hooks/useAuth";

type ViewState = "prompt" | "verifying" | "success" | "error";

const EmailVerificationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [email, setEmail] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("prompt");

  // Load email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Handle token verification
  useEffect(() => {
    if (token) {
      setView("verifying");
      verifyEmail(token).then((res) => {
        if (res.isSuccess && res.data) {
          router.replace(`${ROUTES.AUTH.EMAIL_VERIFICATION}?uid=${res.data}`); // clean URL
          setView("success");
        } else {
          setView("error");
        }
      });
    }
  }, [token, router]);

  const handleGoToGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const handleContinue = () => {
    router.push(`${ROUTES.AUTH.COMPLETE_PROFILE}?uid=${uid}`);
  };

  const handleBack = () => {
    setView("prompt");
  };

  const PromptView = () => {
    return (
      <ShowInformationSection
        imageUrl={IMAGES.EMAIL_VERIFCATION_SUCCESS}
        imageAlt="Email Verification"
        title="Verifikasi Alamat Email Anda"
        subtitle1={
          <p>
            Kamu telah memasukkan <strong>{email}</strong> sebagai alamat email
            untuk akun Anda.
          </p>
        }
        subtitle2="Mohon lakukan verifikasi email dengan menekan tombol di bawah ini."
        onButtonClick={handleGoToGmail}
        buttonText="Verifikasi Email"
      />
    );
  };

  const VerifyingView = () => {
    return (
      <div>
        <p className="text-center">Memverifikasi email...</p>
      </div>
    );
  };

  const SuccessView = () => {
    return (
      <ShowInformationSection
        imageUrl={IMAGES.EMAIL_VERIFCATION_SUCCESS}
        imageAlt="Email Verification Success"
        title="Verifikasi Berhasil"
        subtitle1="Email Anda berhasil diverifikasi."
        onButtonClick={handleContinue}
        buttonText="Lanjut Isi Profil"
      />
    );
  };

  const ErrorView = () => {
    return (
      <ShowInformationSection
        imageUrl={IMAGES.EMAIL_VERIFCATION_ERROR}
        imageAlt="Email Verification Error"
        title="Verifikasi Gagal"
        subtitle1="Link verifikasi tidak valid atau telah kedaluwarsa."
        onButtonClick={handleBack}
        buttonText="Kembali"
      />
    );
  };

  return (
    <>
      {view === "prompt" ? (
        <PromptView />
      ) : view === "verifying" ? (
        <VerifyingView />
      ) : view === "success" ? (
        <SuccessView />
      ) : (
        <ErrorView />
      )}
    </>
  );
};

export default EmailVerificationPage;
