export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success';
}

export interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}
