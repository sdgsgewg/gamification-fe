import { Divider, Modal } from "antd";
import Button from "../shared/Button";

interface ShareTaskModalProps {
  visible: boolean;
  title: string;
  formId: string;
  children: React.ReactNode;
  onCancel: () => void;
  onResetFilters: () => void;
}

export const ShareTaskModal = ({
  visible,
  title,
  formId,
  children,
  onCancel,
  onResetFilters,
}: ShareTaskModalProps) => {
  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      centered
      footer={[
        <div key="footer" className="flex justify-between gap-4 w-full">
          <Button
            key="reset"
            type="primary"
            size="middle"
            variant="outline"
            className="flex-1 !px-4"
            onClick={onResetFilters}
          >
            Reset
          </Button>
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            size="middle"
            variant="primary"
            className="flex-1 !px-4"
            form={formId}
          >
            Share
          </Button>
        </div>,
      ]}
    >
      <Divider
        style={{ margin: "0.8rem 0 1rem 0" }}
        className="!border-light-muted"
      />
      <div className="min-h-[22rem] max-h-[25rem] overflow-y-auto custom-thin-scrollbar">
        {children}
      </div>
      <Divider
        style={{ margin: "1.2rem 0 1.2rem 0" }}
        className="!border-light-muted"
      />
    </Modal>
  );
};
