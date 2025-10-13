"use client";

import React from "react";
import CardWrapper from "../CardWrapper";
import SubjectCard from "@/app/components/shared/cards/SubjectCard";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";

const SubjectCardWrapper: React.FC = () => {
  const { data: subjects = [] } = useSubjects();

  return (
    <CardWrapper>
      {subjects.slice(0, 4).map((subject, index) => (
        <SubjectCard key={index} subject={subject} fromPage="home" />
      ))}
    </CardWrapper>
  );
};

export default SubjectCardWrapper;
