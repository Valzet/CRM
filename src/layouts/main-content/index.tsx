import React, { type FC } from "react";
import { StyledLayout } from "./styled";

export const MainContent: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StyledLayout>{children}</StyledLayout>;
};
