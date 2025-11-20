"use client";

import React, { useState } from "react";
import Button from "@/app/components/shared/Button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPenToSquare,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { IMAGES } from "@/app/constants/images";

export interface ClassDetailTab {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface ClassDetailLayoutProps {
  mode: "student" | "teacher";
  classDetail: {
    id: string;
    name: string;
    description: string;
    image?: string;
  };
  onBack: () => void;
  onPrimaryAction: () => void; // leave / edit
  primaryLabel: string;
  primaryVariant: "danger" | "warning";
  tabs: ClassDetailTab[];
}

const ClassDetailLayout: React.FC<ClassDetailLayoutProps> = ({
  mode,
  classDetail,
  onBack,
  onPrimaryAction,
  primaryLabel,
  primaryVariant,
  tabs,
}) => {
  const [view, setView] = useState(tabs[0].key);

  const renderIcon =
    primaryVariant === "warning" ? faPenToSquare : faRightFromBracket;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-row sm:flex-col gap-4">
          <Button
            type="primary"
            variant="primary"
            size="middle"
            onClick={onBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Back</span>
          </Button>

          <Button
            variant={primaryVariant}
            size="middle"
            onClick={onPrimaryAction}
          >
            <FontAwesomeIcon icon={renderIcon} className="mr-1" />
            <span className="text-base font-semibold">{primaryLabel}</span>
          </Button>
        </div>

        <div className="w-full sm:max-w-[60%] lg:max-w-[40%] flex items-center justify-end gap-4">
          <div className="flex flex-col text-end gap-2">
            <h3 className="text-dark text-2xl md:text-3xl font-bold">
              {classDetail.name}
            </h3>
            <p className="text-sm font-medium">{classDetail.description}</p>
          </div>

          <div className="max-w-32">
            <Image
              src={classDetail.image ?? IMAGES.DEFAULT_CLASS}
              alt={classDetail.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex items-center mt-4 mb-8 border-y border-y-br-primary">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="middle"
              onClick={() => setView(tab.key)}
              className={`relative flex items-center gap-2 !px-10 !py-5 !border-none text-sm transition-all duration-150 !bg-background hover:!bg-background-hover !text-dark`}
            >
              <span className="text-base font-semibold">{tab.label}</span>
              {view === tab.key && (
                <span className="absolute -bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>{tabs.find((t) => t.key === view)?.content}</div>
    </div>
  );
};

export default ClassDetailLayout;
