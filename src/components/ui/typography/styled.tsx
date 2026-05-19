import styled from "styled-components";

export const H1 = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilies.heading};
  font-weight: ${({ theme }) => theme.typography.heading.h1.fontWeight};
  font-size: ${({ theme }) => theme.typography.heading.h1.fontSize};
  line-height: ${({ theme }) => theme.typography.heading.h1.lineHeight};
  color: ${({ theme }) => theme.color.neutral.textPrimary};
`;

export const H2 = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilies.heading};
  font-weight: ${({ theme }) => theme.typography.heading.h2.fontWeight};
  font-size: ${({ theme }) => theme.typography.heading.h2.fontSize};
  line-height: ${({ theme }) => theme.typography.heading.h2.lineHeight};
  color: ${({ theme }) => theme.color.neutral.textPrimary};
`;

export const H3 = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilies.heading};
  font-weight: ${({ theme }) => theme.typography.heading.h3Mobile.fontWeight};
  font-size: ${({ theme }) => theme.typography.heading.h3Mobile.fontSize};
  line-height: ${({ theme }) => theme.typography.heading.h3Mobile.lineHeight};
  color: ${({ theme }) => theme.color.neutral.textPrimary};

  @media (min-width: ${({ theme }) => theme.grid.breakpoints.desktopMin}) {
    font-size: ${({ theme }) => theme.typography.heading.h3.fontSize};
    line-height: ${({ theme }) => theme.typography.heading.h3.lineHeight};
    font-weight: ${({ theme }) => theme.typography.heading.h3.fontWeight};
  }
`;

export const Body = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilies.body};
  font-size: ${({ theme }) => theme.typography.body.base.fontSize};
  line-height: ${({ theme }) => theme.typography.body.base.lineHeight};
  font-weight: 400;
  color: ${({ theme }) => theme.color.neutral.textPrimary};
`;

export const BodySmall = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilies.body};
  font-size: ${({ theme }) => theme.typography.body.sm.fontSize};
  line-height: ${({ theme }) => theme.typography.body.sm.lineHeight};
  font-weight: 400;
  color: ${({ theme }) => theme.color.neutral.textPrimary};
`;

export const Caption = styled.span`
  font-family: ${({ theme }) => theme.fontFamilies.body};
  font-size: ${({ theme }) => theme.typography.body.xs.fontSize};
  line-height: ${({ theme }) => theme.typography.body.xs.lineHeight};
  font-weight: ${({ theme }) => theme.typography.body.xs.fontWeight};
  color: ${({ theme }) => theme.color.neutral.textSecondary};
`;
