import type { ReactNode } from "react";
import {
  MODAL_WIDTH_PX,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalMeta,
  ModalShell,
  ModalTitle,
  StyledModal,
} from "./crm-modal.styled";

type Props = {
  open: boolean;
  title: string;
  meta?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
};

export function CrmModal(props: Props) {
  const { open, title, meta, onClose, children, footer, loading } = props;

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={MODAL_WIDTH_PX}
      destroyOnHidden
      centered
      confirmLoading={loading}
      closable
      maskClosable
    >
      <ModalShell>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {meta ? <ModalMeta>{meta}</ModalMeta> : null}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer ? <ModalFooter>{footer}</ModalFooter> : null}
      </ModalShell>
    </StyledModal>
  );
}
