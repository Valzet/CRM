import styled from "styled-components";
import backgroundStart from "../../assets/backgroundStart.png";
import { color, grid } from "../../theme/tokens";

export const AuthRoot = styled.div`
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
  background-color: #ffffff;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image: url(${backgroundStart});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
  }
`;

export const AuthGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 1fr);
  gap: clamp(24px, 5vw, 64px);
  max-width: 1120px;
  min-height: 100dvh;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px);
  align-items: center;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 24px ${grid.mobile.marginPx}px 28px;
    max-width: ${grid.mobile.designWidthPx}px;
  }

  @media (min-width: 768px) and (max-width: 900px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

export const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 440px;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: none;
  }

  @media (min-width: 768px) and (max-width: 900px) {
    max-width: none;
  }
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BrandName = styled.span`
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  color: var(--crm-color-text);
`;

export const BrandCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BrandText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--crm-color-text-secondary);
`;

export const BrandFooter = styled.div`
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--crm-color-text-secondary);

  a {
    color: var(--crm-color-accent-primary);
    font-weight: 500;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const FormColumn = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    position: relative;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    padding-bottom: 72px;
  }
`;

export const FormColumnMain = styled.div`
  width: 100%;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    flex: 0 1 auto;
    margin-block: auto;
    max-height: calc(100% - 72px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export const MobileAuthFooter = styled.div`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    flex-shrink: 0;
  }
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 440px;
  padding: clamp(28px, 4vw, 40px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.06),
    0 16px 40px -12px rgb(0 0 0 / 0.12);

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    max-width: none;
    padding: 0;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    font-size: 14px;
    color: var(--crm-color-text-secondary);
    height: auto;
  }

  .ant-form-item-label {
    padding-bottom: 4px;
  }

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    .ant-form-item {
      margin-bottom: 20px;
    }

    .ant-form-item-label > label {
      font-size: 13px;
    }

    .ant-input,
    .ant-input-affix-wrapper,
    .ant-input-password {
      min-height: 44px;
      border-radius: 8px;
      background: #ffffff;
    }

    .ant-input-affix-wrapper .ant-input {
      min-height: auto;
    }

    .ant-btn-lg {
      height: 48px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
    }

    .ant-btn-primary.ant-btn-lg:not(:disabled) {
      box-shadow: 0 4px 12px rgb(59 130 246 / 0.35);
    }

    .ant-btn-default.ant-btn-lg {
      height: 48px;
      border-radius: 8px;
      font-weight: 600;
      background: #ffffff;
      border-color: ${color.neutral.border};
      color: ${color.neutral.textPrimary};
    }
  }
`;

export const CardTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--crm-color-text);

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    margin-bottom: 12px;
    font-size: 1.375rem;
  }
`;

export const CardSubtitle = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--crm-color-text-secondary);

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    margin-bottom: 28px;
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const BrandLogo = styled.img`
  display: block;
  height: 40px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const FooterCaption = styled.span`
  font-size: 14px;
  line-height: 1.4;
  color: var(--crm-color-text-secondary);
`;

export const LeftFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  font-size: 14px;
  line-height: 1.4;

  a {
    color: var(--crm-color-accent-primary);
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (min-width: ${grid.breakpoints.desktopMin}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35em;
    color: var(--crm-color-text-secondary);

    a {
      font-weight: 500;
    }
  }
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    gap: 12px;
  }
`;

export const FormMutedCaption = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--crm-color-text-secondary);
`;

export const ForgotPasswordRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -12px;
  margin-bottom: 20px;

  a {
    font-size: 13px;
    color: var(--crm-color-text-secondary);
    font-weight: 400;
    text-decoration: none;
  }

  a:hover {
    color: var(--crm-color-accent-primary);
    text-decoration: none;
  }
`;

export const LandingInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100dvh;
  max-width: ${grid.mobile.designWidthPx}px;
  margin: 0 auto;
  padding: 32px ${grid.mobile.marginPx}px;
  gap: 20px;
`;

export const LandingBrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LandingLogo = styled.img`
  display: block;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  object-fit: contain;
`;

export const LandingBrandName = styled.span`
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  color: ${color.neutral.textPrimary};
`;

export const LandingBrandYa = styled.span`
  color: ${color.accent.primary};
`;

export const LandingText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${color.neutral.textSecondary};
`;

export const LandingActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;

  a {
    display: block;
    text-decoration: none;
  }

  .ant-btn {
    height: 48px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
  }

  .ant-btn-primary {
    box-shadow: none;
  }

  .ant-btn-default {
    background: ${color.background.secondary};
    border-color: ${color.neutral.border};
    color: ${color.neutral.textPrimary};
  }
`;
