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
      case "submit":
        defaultText =
          "Apakah anda yakin ingin mengumpulkan aktivitas ini? Mohon dikoreksi kembali.";
        break;
      case "delete":
        defaultText =
          "Semua perubahan yang dilakukan akan dihapus. Apakah anda yakin ingin keluar dari halaman ini?";
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
          Iya
        </Button>
        <Button variant={getCancelButtonVariant()} onClick={onCancel}>
          Tidak
        </Button>
      </div>
    </Modal>
  );
};

interface BackConfirmationModalProps {
  visible: boolean;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BackConfirmationModal = ({
  visible,
  text,
  onConfirm,
  onCancel,
}: BackConfirmationModalProps) => {
  const defaultText =
    text ??
    "Semua perubahan yang dilakukan akan dihapus. Apakah anda yakin ingin keluar dari halaman ini?";

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
      <p className="text-base font-semibold mb-6">{defaultText}</p>
      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={onConfirm}>
          Iya
        </Button>
        <Button variant="primary" onClick={onCancel}>
          Tidak
        </Button>
      </div>
    </Modal>
  );
};

interface SubmitConfirmationModalProps {
  visible: boolean;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmationModal = ({
  visible,
  text,
  onConfirm,
  onCancel,
}: SubmitConfirmationModalProps) => {
  const defaultText =
    text ??
    "Apakah anda yakin ingin mengumpulkan aktivitas ini? Mohon dikoreksi kembali.";

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
      <p className="text-base font-semibold mb-6">{defaultText}</p>
      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={onConfirm}>
          Iya
        </Button>
        <Button variant="primary" onClick={onCancel}>
          Tidak
        </Button>
      </div>
    </Modal>
  );
};

interface DeleteConfirmationModalProps {
  visible: boolean;
  modalText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({
  visible,
  modalText,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
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
      <p className="text-base font-semibold mb-6">{modalText}</p>
      <div className="flex flex-col gap-3">
        <Button variant="danger" onClick={onConfirm}>
          Iya
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Tidak
        </Button>
      </div>
    </Modal>
  );
};
