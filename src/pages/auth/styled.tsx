import styled from "styled-components";
import backgroundStart from "../../assets/backgroundStart.png";

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

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

export const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 440px;

  @media (max-width: 900px) {
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
`;

export const CardTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--crm-color-text);
`;

export const CardSubtitle = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--crm-color-text-secondary);
`;

export const BrandLogo = styled.img`
  display: block;
  height: 40px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const LeftFooter = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
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
  margin-top: -8px;
  margin-bottom: 16px;

  a {
    font-size: 14px;
    color: var(--crm-color-accent-primary);
    font-weight: 500;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
