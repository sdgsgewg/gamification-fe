import { Modal } from "antd";
import Button from "../shared/Button";

interface MessageModalProps {
  visible: boolean;
  isSuccess: boolean;
  text: string;
  onConfirm: () => void;
}

export const MessageModal = ({
  visible,
  isSuccess = true,
  text,
  onConfirm,
}: MessageModalProps) => {
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
      <h1 className="text-xl font-bold mb-4">
        {isSuccess ? `Sukses` : `Gagal`}
      </h1>
      <p className="text-base font-semibold mb-6">{text}</p>
      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={onConfirm}>
          Ok
        </Button>
      </div>
    </Modal>
  );
};
