import { Link } from "react-router-dom";
import styled from "styled-components";
import { color, grid } from "../../theme/tokens";

export const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 8px ${grid.mobile.marginPx}px;
  background: ${color.background.secondary};
  border-bottom: 1px solid ${color.background.shadowHint};
  flex-shrink: 0;
`;

export const SideSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  flex-shrink: 0;
`;

export const CenterLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  text-decoration: none;
`;

export const LogoImg = styled.img`
  display: block;
  height: 32px;
  width: auto;
  object-fit: contain;
`;

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  color: ${color.neutral.textPrimary};

  &:hover {
    background: ${color.background.primary};
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
  }
`;

export const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: ${color.accent.primary};

  &:hover {
    background: ${color.background.info};
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
  }
`;
