import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { MessageModal } from "@/app/components/modals/MessageModal";

export const AttemptModals = ({
  back,
  submit,
  message,
  onBackConfirm,
  onSubmitConfirm,
  onMessageConfirm,
  setBack,
  setSubmit,
}: any) => (
  <>
    <ConfirmationModal
      visible={back.visible}
      text={back.text}
      type="back"
      onConfirm={onBackConfirm}
      onCancel={() => setBack({ ...back, visible: false })}
    />

    <ConfirmationModal
      visible={submit.visible}
      text={submit.text}
      type="submit"
      onConfirm={onSubmitConfirm}
      onCancel={() => setSubmit({ ...submit, visible: false })}
    />

    <MessageModal
      visible={message.visible}
      isSuccess={message.isSuccess}
      text={message.text}
      onConfirm={onMessageConfirm}
    />
  </>
);
