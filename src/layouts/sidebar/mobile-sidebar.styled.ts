import { NavLink } from "react-router-dom";
import styled from "styled-components";
import backgroundStart from "../../assets/backgroundStart.png";
import { color, grid, typography } from "../../theme/tokens";

export const MobileShell = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
  max-width: ${grid.mobile.designWidthPx}px;
  overflow: hidden;
  background-color: #ffffff;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url(${backgroundStart});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
  }
`;

export const MobileInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100dvh;
`;

export const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px ${grid.mobile.marginPx}px 16px;
  flex-shrink: 0;
`;

export const MobileBrandLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
`;

export const MobileBrandIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const MobileBrandName = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: ${color.neutral.textPrimary};
`;

export const MobileBrandYa = styled.span`
  color: ${color.accent.primary};
`;

export const MobileCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 8px;
  color: ${color.neutral.textPrimary};

  &:hover {
    background: rgba(255, 255, 255, 0.45);
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
  }
`;

export const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px 0;
`;

export const MobileNavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 52px;
  padding: 0 ${grid.mobile.marginPx}px;
  text-decoration: none;
  color: ${color.neutral.textPrimary};
  font-size: ${typography.body.base.fontSize};
  line-height: ${typography.body.base.lineHeight};
  font-weight: 400;
  border-bottom: 1px solid rgba(31, 41, 55, 0.08);
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  &[aria-current="page"],
  &[data-active="true"] {
    color: ${color.accent.primary};
    font-weight: 500;
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(203deg)
      brightness(101%) contrast(96%);
  }
`;
