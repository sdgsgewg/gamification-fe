import { Modal } from "antd";
import Button from "../shared/Button";
import { ConfirmationModalType } from "@/app/types/ConfirmationModalType";

interface ConfirmationModalProps {
  visible: boolean;
  text?: string;
  type: ConfirmationModalType;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  visible,
  text,
  type,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const getText = () => {
    if (text) return text;

    let defaultText = "";

    switch (type) {
      case "back":
        defaultText =
          "Semua perubahan yang dilakukan akan dihapus. Apakah anda yakin ingin keluar dari halaman ini?";
        break;
      case "publish":
        defaultText =
          "Are you sure you want to publish this item? After publishing, it will become visible to users.";
        break;
      case "unpublish":
        defaultText =
          "Are you sure you want to unpublish this item? Users will no longer be able to access it until published again.";
        break;
      case "finalize":
        defaultText =
          "Are you sure you want to finalize this item? Once finalized, it can no longer be edited.";
        break;
      case "submit":
        defaultText =
          "All changes made will be lost. Are you sure you want to leave this page?";
        break;
      case "delete":
        defaultText = "Are you sure you want to delete this item?";
        break;
      default:
        defaultText = "";
        break;
    }

    return defaultText;
  };

  const getConfirmButtonVariant = () => {
    if (type === "delete") return "danger";
    return "outline";
  };

  const getCancelButtonVariant = () => {
    if (type === "delete") return "outline";
    return "primary";
  };

  return (
    <Modal
      open={visible}
      footer={null} // hilangkan default footer
      closable={false} // hilangkan tombol close (X)
      centered
      width={400}
      styles={{
        body: {
          textAlign: "center",
          padding: "0.5rem 1.5rem",
        },
      }}
    >
      <p className="text-base font-semibold mb-6">{getText()}</p>
      <div className="flex flex-col gap-3">
        <Button variant={getConfirmButtonVariant()} onClick={onConfirm}>
          Yes
        </Button>
        <Button variant={getCancelButtonVariant()} onClick={onCancel}>
          No
        </Button>
      </div>
    </Modal>
  );
};
