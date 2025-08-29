"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DashboardHomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard Home</h2>
      <p className="text-gray-700">
        Ini adalah halaman utama dashboard setelah user login. Kamu bisa
        menampilkan ringkasan data, statistik, atau navigasi cepat di sini.
      </p>
    </div>
  );
};

export default DashboardHomePage;
