"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useNavigationGuard(isDirty: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!isDirty) return;

    const message =
      "Perubahan belum disimpan. Yakin mau meninggalkan halaman ini?";

    // ✅ Handle refresh / close tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // wajib untuk trigger dialog
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // ✅ Patch internal navigation
    // const originalPush = router.push;
    // const originalReplace = router.replace;
    // const originalBack = router.back;

    // router.push = (url, options) => {
    //   const confirmLeave = window.confirm(message);
    //   if (confirmLeave) {
    //     return originalPush(url, options);
    //   }
    //   return Promise.resolve(); // batal
    // };

    // router.replace = (url, options) => {
    //   const confirmLeave = window.confirm(message);
    //   if (confirmLeave) {
    //     return originalReplace(url, options);
    //   }
    //   return Promise.resolve(); // batal
    // };

    // router.back = () => {
    //   const confirmLeave = window.confirm(message);
    //   if (confirmLeave) {
    //     return originalBack();
    //   }
    //   return; // batal
    // };

    // ✅ Cleanup → balikin semua
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      //   router.push = originalPush;
      //   router.replace = originalReplace;
      //   router.back = originalBack;
    };
  }, [isDirty, router]);
}
