"use client";

import React from "react";
import Button from "../../shared/Button";
import { useRouter } from "next/navigation";
import { Dropdown, Space } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPenToSquare,
  faTrashAlt,
  faEllipsisVertical,
  faShareNodes,
  faCloudArrowUp,
  faCloudArrowDown,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { TaskStatus } from "@/app/enums/TaskStatus";
import { TaskDetailResponse } from "@/app/interface/tasks/responses/ITaskDetailResponse";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";
import { getTaskRules } from "@/app/utils/tasks/taskRules";

interface DashboardTitleProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  task?: TaskDetailResponse;

  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;

  onShare?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onFinalize?: () => void;
}

const DashboardTitle = ({
  title,
  subtitle,
  showBackButton,
  task,
  onBack,
  onEdit,
  onDelete,
  onShare,
  onPublish,
  onUnpublish,
  onFinalize,
}: DashboardTitleProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  const status = task?.taskDetail.status ?? TaskStatus.DRAFT;
  const scope = task?.taskDetail.taskType.scope ?? TaskTypeScope.ACTIVITY;

  const rules = getTaskRules(status, scope);

  // ----- DROPDOWN BUILDER -----
  const items: ItemType[] = [];

  const push = (condition: boolean, item: ItemType) => {
    if (condition) items.push(item);
  };

  push(rules.edit && !!onEdit, {
    key: "edit",
    label: "Edit",
    icon: <FontAwesomeIcon icon={faPenToSquare} />,
    onClick: onEdit!,
  });

  push(rules.share && !!onShare, {
    key: "share",
    label: "Share",
    icon: <FontAwesomeIcon icon={faShareNodes} />,
    onClick: onShare!,
  });

  push(rules.publish && !!onPublish, {
    key: "publish",
    label: "Publish",
    icon: <FontAwesomeIcon icon={faCloudArrowUp} />,
    onClick: onPublish!,
  });

  push(rules.unpublish && !!onUnpublish, {
    key: "unpublish",
    label: "Unpublish",
    icon: <FontAwesomeIcon icon={faCloudArrowDown} />,
    onClick: onUnpublish!,
  });

  push(rules.finalize && !!onFinalize, {
    key: "finalize",
    label: "Finalize",
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
    onClick: onFinalize!,
  });

  // DELETE GROUP
  if (rules.delete && onDelete) {
    items.push({ type: "divider" });

    push(true, {
      key: "delete",
      label: <span className="text-red-500">Delete</span>,
      icon: <FontAwesomeIcon icon={faTrashAlt} className="text-red-500" />,
      onClick: onDelete,
    });
  }

  return (
    <div className="flex items-center justify-between pb-2 border-b border-b-dark">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {(showBackButton || onBack) && (
          <Button variant="primary" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Back</span>
          </Button>
        )}

        <div>
          <h1 className="text-3xl text-dark font-bold">{title}</h1>
          {subtitle && <p className="text-tx-tertiary mt-2">{subtitle}</p>}
        </div>
      </div>

      {/* RIGHT SIDE – ACTION DROPDOWN */}
      {items.length > 0 && (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space className="bg-primary cursor-pointer px-3 py-2 hover:bg-primary-hover text-white rounded-md">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Space>
        </Dropdown>
      )}
    </div>
  );
};

export default DashboardTitle;
