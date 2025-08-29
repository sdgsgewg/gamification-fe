"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardTitle from "../components/pages/Dashboard/DashboardTitle";
import Loading from "../components/shared/Loading";

const DashboardHomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }

    // set loading hanya 3 detik
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // cleanup jika user pindah halaman sebelum 3 detik
    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />
      <h2 className="text-2xl font-bold">Dashboard Home</h2>
      <p className="text-gray-700">
        Ini adalah halaman utama dashboard setelah user login. Kamu bisa
        menampilkan ringkasan data, statistik, atau navigasi cepat di sini.
      </p>
    </>
  );
};

export default DashboardHomePage;
