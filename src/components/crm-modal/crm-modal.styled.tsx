import { Modal } from "antd";
import styled, { css } from "styled-components";
import { UiButton } from "../ui/button";
import { color, fontFamilies, typography } from "../../theme/tokens";

export const MODAL_WIDTH_PX = 580;
export const MODAL_HEIGHT_PX = 414;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: ${MODAL_WIDTH_PX}px;
    height: ${MODAL_HEIGHT_PX}px;
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);
  }

  .ant-modal-body {
    padding: 0;
    height: 100%;
  }

  .ant-modal-close {
    top: 12px;
    inset-inline-end: 12px;
    color: ${color.neutral.textSecondary};
  }
`;

export const ModalShell = styled.div`
  display: flex;
  flex-direction: column;
  height: ${MODAL_HEIGHT_PX}px;
  padding: 20px 24px 20px;
  background: ${color.background.secondary};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h3.fontSize};
  line-height: ${typography.heading.h3.lineHeight};
  font-weight: 700;
  color: ${color.neutral.textPrimary};
`;

export const ModalMeta = styled.span`
  flex-shrink: 0;
  padding-top: 4px;
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  white-space: nowrap;
`;

export const ModalBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-shrink: 0;
`;

export const FieldGrid = styled.div<{ $columns?: 1 | 2 }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$columns === 1 ? "1fr" : "1fr 1fr")};
  gap: 10px 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
`;

export const FieldControl = styled.div`
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-input-number,
  .ant-select-selector,
  .ant-input-textarea textarea {
    font-size: ${typography.body.sm.fontSize};
    border-radius: ${typography.controlBorderRadiusPx}px;
    border-color: ${color.neutral.border};
  }

  .ant-input,
  .ant-input-affix-wrapper,
  .ant-select-selector {
    min-height: 32px !important;
    padding-block: 4px !important;
  }

  .ant-input-textarea textarea {
    min-height: 52px !important;
    padding: 6px 10px;
    resize: none;
  }

  .ant-select-selector {
    align-items: center;
  }

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item-explain-error {
    font-size: 11px;
    margin-top: 2px;
  }
`;

export const ReadOnlyValue = styled.div`
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid ${color.neutral.border};
  border-radius: ${typography.controlBorderRadiusPx}px;
  font-size: ${typography.body.sm.fontSize};
  line-height: 20px;
  color: ${color.neutral.textPrimary};
  background: ${color.background.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ReadOnlyTextarea = styled(ReadOnlyValue)`
  min-height: 52px;
  white-space: pre-wrap;
  overflow: auto;
`;

export const StatusReadOnly = styled(ReadOnlyValue)<{ $tone?: "primary" | "default" }>`
  ${(p) =>
    p.$tone === "primary" &&
    css`
      color: ${color.accent.primary};
      font-weight: 500;
    `}
`;

const footerBtnBase = css`
  && {
    height: 36px;
    border-radius: ${typography.controlBorderRadiusPx}px;
    font-size: ${typography.body.sm.fontSize};
    font-weight: 500;
    box-shadow: none;
  }
`;

export const PrimaryFooterButton = styled(UiButton)`
  ${footerBtnBase}
  && {
    flex: 1 1 62%;
    min-width: 0;
  }
`;

export const SecondaryFooterButton = styled(UiButton)`
  ${footerBtnBase}
  && {
    flex: 0 0 auto;
    min-width: 118px;
    background: ${color.background.secondary};
    border-color: ${color.neutral.border};
    color: ${color.neutral.textPrimary};
  }
  &&:hover {
    background: ${color.background.primary};
    border-color: ${color.neutral.border};
    color: ${color.neutral.textPrimary};
  }
`;

export const SuccessFooterButton = styled(SecondaryFooterButton)`
  &&,
  &&:hover {
    color: ${color.accent.success};
  }
`;

export const DangerFooterButton = styled(SecondaryFooterButton)`
  &&,
  &&:hover {
    color: ${color.accent.error};
  }
`;
