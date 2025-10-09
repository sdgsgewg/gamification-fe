"use client";

import React, { useEffect, useState } from "react";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { message } from "antd";
import CardWrapper from "../CardWrapper";
import SubjectCard from "@/app/components/shared/cards/SubjectCard";

const SubjectCardWrapper: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectOverviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubjects = async (searchText?: string) => {
    setIsLoading(true);
    const res = await subjectProvider.getSubjects({ searchText });
    if (res.isSuccess && res.data) {
      setSubjects(
        res.data.map((s: SubjectOverviewResponse, idx: number) => ({
          key: s.subjectId ?? idx,
          ...s,
        }))
      );
    } else {
      message.error("Gagal memuat mata pelajaran");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <CardWrapper>
      {subjects.slice(0, 4).map((subject, index) => (
        <SubjectCard key={index} subject={subject} fromPage="home" />
      ))}
    </CardWrapper>
  );
};

export default SubjectCardWrapper;
