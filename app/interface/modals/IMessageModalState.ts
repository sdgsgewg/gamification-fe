type MessageModalType = "submit" | "back" | null;

export interface MessageModalState {
  visible: boolean;
  isSuccess: boolean;
  text: string;
  type: MessageModalType;
}
