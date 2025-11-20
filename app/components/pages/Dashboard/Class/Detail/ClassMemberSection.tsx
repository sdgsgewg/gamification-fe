"use client";

import React, { useState } from "react";
import {
  MemberCard,
  MemberCardSkeleton,
  MemberCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import Button from "@/app/components/shared/Button";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { useClassMember } from "@/app/hooks/classes/useClassMember";
import { MemberRole } from "@/app/types/class-detail";

interface ClassMemberSectionProps {
  classSlug: string;
  notFoundText?: string;
}

const ClassMemberSection: React.FC<ClassMemberSectionProps> = ({
  classSlug,
  notFoundText = "Member not found.",
}) => {
  const { data: classMember, isLoading } = useClassMember(classSlug);
  const [view, setView] = useState<MemberRole>("students");

  if (!classMember) return null;

  const tabs: { key: MemberRole; label: string }[] = [
    { key: "students", label: "Student" },
    { key: "teacher", label: "Teacher" },
  ];

  const members =
    view === "students" ? classMember.students : classMember.teacher;

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => {
            const count =
              tab.key === "students"
                ? classMember.students.length
                : classMember.teacher.length;

            return (
              <Button
                key={tab.key}
                size="middle"
                onClick={() => setView(tab.key)}
                className={`relative flex items-center gap-2 !px-7 !py-6 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150 ${
                  view === tab.key
                    ? "!bg-primary !text-white"
                    : "!bg-tertiary hover:!bg-tertiary-hover !text-dark"
                }`}
              >
                <span
                  className={`flex flex-col text-sm ${
                    view === tab.key ? "font-semibold" : "font-medium"
                  }`}
                >
                  <p>{count}</p>
                  <p>{tab.label}</p>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Member Grid */}
      {isLoading ? (
        <MemberCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <MemberCardSkeleton key={idx} />
          ))}
        </MemberCardWrapper>
      ) : members.length > 0 ? (
        <MemberCardWrapper>
          {members.map((m, idx) => (
            <MemberCard key={idx} image={m.image} name={m.name} />
          ))}
        </MemberCardWrapper>
      ) : (
        <div className="mt-8">
          <NotFound text={notFoundText} />
        </div>
      )}
    </div>
  );
};

export default ClassMemberSection;
