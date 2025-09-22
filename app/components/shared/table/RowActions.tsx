import React from "react";
import { Space } from "antd";

import Button, { ButtonVariant } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

interface RowActionButtonProps {
  variant?: ButtonVariant;
  onClick: () => void;
  children: React.ReactNode;
}

const RowActionButton: React.FC<RowActionButtonProps> = ({
  variant = "primary",
  onClick,
  children,
}) => {
  return (
    <Button variant={variant} onClick={onClick} className="!p-3">
      {children}
    </Button>
  );
};

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Space>
      {onView && (
        <RowActionButton variant="view" onClick={onView}>
          <FontAwesomeIcon icon={faEye} />
        </RowActionButton>
      )}
      {onEdit && (
        <RowActionButton variant="warning" onClick={onEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </RowActionButton>
      )}
      {onDelete && (
        <RowActionButton variant="danger" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </RowActionButton>
      )}
    </Space>
  );
};

export default RowActions;
