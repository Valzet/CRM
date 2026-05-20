import { color, fontFamilies, grid, typography } from "../../theme/tokens";
import styled from "styled-components";

import { Button, Form, Typography } from "antd";

const SettingsPageRoot = styled.div`
  flex: 1;
  min-height: 100%;
  padding: 28px 4px 48px;
  background: transparent;
  max-width: 680px;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    padding: 16px 0 calc(32px + env(safe-area-inset-bottom, 0px));
  }
`;

const SettingsInner = styled.div<{ $centered?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.$centered ? "720px" : "none")};
  margin: ${(p) => (p.$centered ? "0 auto" : "0")};
`;

const PageHeading = styled.h1`
  margin: 0 0 28px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h2.fontSize};
  line-height: ${typography.heading.h2.lineHeight};
  font-weight: ${typography.heading.h2.fontWeight};
  color: ${color.neutral.textPrimary};
`;

const SettingsSurface = styled.div`
  background: ${color.background.secondary};
  border-radius: 12px;
  padding: 40px 40px 32px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  border: 1px solid ${color.background.shadowHint};

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const AvatarBlock = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 32px;
`;

const AvatarCameraBtn = styled(Button)`
  position: absolute;
  right: -4px;
  bottom: -4px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
`;

const MetaLine = styled(Typography.Text)`
  display: block;
  margin-bottom: 20px;
  color: ${color.neutral.textSecondary};
  font-size: ${typography.body.sm.fontSize};
`;

const StyledForm = styled(Form)`
  .ant-form-item .ant-form-item-label > label {
    color: ${color.neutral.textSecondary};
    font-size: ${typography.body.xs.fontSize};
    line-height: ${typography.body.xs.lineHeight};
    height: auto;
  }
`;

const SectionHeading = styled.h2`
  margin: 8px 0 20px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h3.fontSize};
  line-height: ${typography.heading.h3.lineHeight};
  font-weight: ${typography.heading.h3.fontWeight};
  color: ${color.neutral.textPrimary};
`;

const FormFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
`;

const DeleteAccountLink = styled(Button)`
  && {
    padding: 0;
    height: auto;
    color: ${color.accent.primary};
    font-weight: 500;
  }
  &&:hover {
    color: ${color.accent.hover};
  }
`;

const BackLinkRow = styled.div`
  margin-top: 24px;
  padding-top: 8px;
`;

export {
  SettingsPageRoot,
  SettingsInner,
  PageHeading,
  SettingsSurface,
  AvatarBlock,
  AvatarCameraBtn,
  MetaLine,
  StyledForm,
  SectionHeading,
  FormFooter,
  DeleteAccountLink,
  BackLinkRow,
};
