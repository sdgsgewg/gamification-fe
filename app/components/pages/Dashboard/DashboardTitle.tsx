"use client";

import React from "react";
import Button from "../../shared/Button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faPenToSquare, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";

interface DashboardTitleProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const DashboardTitle = ({
  title,
  showBackButton,
  onBack,
  onEdit,
  onDelete,
  onShare,
}: DashboardTitleProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <div className="flex items-center justify-between pb-2 border-b-1 border-b-dark">
      <div className="flex items-center gap-4">
        {(showBackButton || onBack) && (
          <Button
            type="primary"
            size="middle"
            variant="primary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Kembali</span>
          </Button>
        )}
        {onEdit && (
          <Button
            type="primary"
            size="middle"
            variant="warning"
            onClick={onEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
            <span className="text-base font-semibold">Edit</span>
          </Button>
        )}
        {onDelete && (
          <Button
            type="primary"
            size="middle"
            variant="danger"
            onClick={onDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
            <span className="text-base font-semibold">Hapus</span>
          </Button>
        )}
        {title && <h1 className="text-3xl text-dark font-bold">{title}</h1>}
      </div>
      {onShare && (
        <div>
          <Button
            type="primary"
            size="middle"
            variant="primary"
            onClick={onShare}
          >
            <FontAwesomeIcon icon={faShareNodes} className="mr-1" />
            <span className="text-base font-semibold">Bagikan</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardTitle;
