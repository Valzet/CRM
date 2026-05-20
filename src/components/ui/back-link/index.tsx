import { Link, type LinkProps } from "react-router-dom";
import styled from "styled-components";
import arrowIcon from "../../../assets/icons/16x16/Arrow.svg";

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;

  &:hover {
    opacity: 0.85;
  }
`;

const ArrowImg = styled.img`
  width: 18px;
  height: 16px;
  display: block;
  flex-shrink: 0;
`;

export function BackLink({ children, ...props }: LinkProps) {
  return (
    <StyledLink {...props}>
      <ArrowImg src={arrowIcon} alt="" aria-hidden decoding="async" />
      {children}
    </StyledLink>
  );
}
