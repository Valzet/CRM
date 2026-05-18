import React, { type FC } from 'react';
import { StyledHeader } from './styled';

export const Header: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StyledHeader>{children}</StyledHeader>;
};
