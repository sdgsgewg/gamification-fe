"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShowInformationSection from "@/app/components/pages/Auth/ShowInformationSection";
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { useAuth } from "@/app/hooks/auth/useAuth";
import Loading from "@/app/components/shared/Loading";

export const dynamic = "force-dynamic";

type ViewState = "prompt" | "verifying" | "success" | "error";

const EmailVerificationPageContent = () => {
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
        imageUrl={IMAGES.EMAIL_VERIFICATION_SUCCESS}
        imageAlt="Email Verification"
        title="Verify Your Email Address"
        subtitle1={
          <p>
            You have entered <strong>{email}</strong> as the email address for
            your account.
          </p>
        }
        subtitle2="Please verify your email by clicking the button below."
        onButtonClick={handleGoToGmail}
        buttonText="Verify Email"
      />
    );
  };

  const VerifyingView = () => {
    return (
      <div>
        <p className="text-center">Verifying email...</p>
      </div>
    );
  };

  const SuccessView = () => {
    return (
      <ShowInformationSection
        imageUrl={IMAGES.EMAIL_VERIFICATION_SUCCESS}
        imageAlt="Email Verification Success"
        title="Verification Successful"
        subtitle1="Your email has been successfully verified."
        onButtonClick={handleContinue}
        buttonText="Continue to Profile Setup"
      />
    );
  };

  const ErrorView = () => {
    return (
      <ShowInformationSection
        imageUrl={IMAGES.EMAIL_VERIFICATION_ERROR}
        imageAlt="Email Verification Error"
        title="Verification Failed"
        subtitle1="The verification link is invalid or has expired."
        onButtonClick={handleBack}
        buttonText="Back"
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

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EmailVerificationPageContent />
    </Suspense>
  );
}
