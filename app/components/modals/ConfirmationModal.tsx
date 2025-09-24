import { Modal } from "antd";
import Button from "../shared/Button";

interface BackConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BackConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
}: BackConfirmationModalProps) => {
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
      <p className="text-base font-semibold mb-6">
        Semua perubahan yang dilakukan akan dihapus. Apakah anda yakin ingin
        keluar dari halaman ini?
      </p>
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
