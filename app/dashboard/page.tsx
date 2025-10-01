"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardTitle from "../components/pages/Dashboard/DashboardTitle";
import Loading from "../components/shared/Loading";

const DashboardHomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <>
    </>
  );
};

export default DashboardHomePage;