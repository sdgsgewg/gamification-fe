"use client";

import React from "react";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import SubjectCard from "@/app/components/shared/cards/SubjectCard";
import PageLayout from "../page-layout";

const SubjectPage = () => {
  const { data: subjects = [] } = useSubjects();

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold mb-8">Subjects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 xl:gap-y-12 gap-x-0 sm:gap-x-8 xl:gap-x-12">
        {subjects.map((subject, index) => (
          <SubjectCard key={index} subject={subject} fromPage="subjects" />
        ))}
      </div>
    </PageLayout>
  );
};

export default SubjectPage;