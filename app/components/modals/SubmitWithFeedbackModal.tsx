import { Modal, Input } from "antd";
import Button from "../shared/Button";
import { useState } from "react";

interface SubmitWithFeedbackModalProps {
  visible: boolean;
  text?: string;
  onSubmit: (feedback: string | null) => void;
  onCancel: () => void;
}

export const SubmitWithFeedbackModal = ({
  visible,
  text,
  onSubmit,
  onCancel,
}: SubmitWithFeedbackModalProps) => {
  const [feedback, setFeedback] = useState("");

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width={450}
      styles={{
        body: {
          textAlign: "center",
          padding: "1rem 1.5rem",
        },
      }}
    >
      <p className="text-base font-semibold mb-4">
        {text ??
          "Are you sure you want to submit? You may provide feedback below."}
      </p>

      <Input.TextArea
        rows={4}
        placeholder="Write feedback (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className="flex flex-col gap-3 mt-6">
        <Button variant="primary" onClick={() => onSubmit(feedback || null)}>
          Submit
        </Button>

        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
