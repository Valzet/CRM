import {
  color,
  fontFamilies,
  grid,
  gridDesktopInlineSizePx,
  layout,
  space,
  typography,
} from "./tokens";

export type AppStyledTheme = {
  color: typeof color;
  fontFamilies: typeof fontFamilies;
  grid: typeof grid;
  layout: typeof layout;
  gridDesktopInlineSizePx: typeof gridDesktopInlineSizePx;
  space: typeof space;
  typography: typeof typography;
};

export const appStyledTheme: AppStyledTheme = {
  color,
  fontFamilies,
  grid,
  layout,
  gridDesktopInlineSizePx,
  space,
  typography,
};
