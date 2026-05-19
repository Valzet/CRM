import styled from "styled-components";
import { grid, gridDesktopInlineSizePx } from "../../../theme/tokens";

export const PageGrid = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding-left: ${grid.mobile.marginPx}px;
  padding-right: ${grid.mobile.marginPx}px;
  display: grid;
  column-gap: ${grid.gutterPx}px;
  row-gap: ${grid.gutterPx}px;
  grid-template-columns: repeat(${grid.mobile.columns}, minmax(0, 1fr));

  @media (min-width: ${grid.breakpoints.desktopMin}) {
    max-width: ${gridDesktopInlineSizePx}px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
    grid-template-columns: repeat(${grid.desktop.columns}, ${grid.desktop.columnWidthPx}px);
    justify-content: center;
  }
`;

export type GridSpanDesktop = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridSpanMobile = 1 | 2 | 3 | 4;

export const GridColumn = styled.div<{
  $desktopSpan: GridSpanDesktop;
  $mobileSpan?: GridSpanMobile;
}>`
  min-width: 0;
  grid-column: span ${({ $mobileSpan = 4 }) => $mobileSpan};

  @media (min-width: ${({ theme }) => theme.grid.breakpoints.desktopMin}) {
    grid-column: span ${({ $desktopSpan }) => $desktopSpan};
  }
`;
