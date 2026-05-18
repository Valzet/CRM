import { createGlobalStyle } from "styled-components";
import {
  color as palette,
  fontFamilies as fonts,
  grid as gridTokens,
  gridDesktopInlineSizePx,
  space,
  typography as typeTokens,
} from "./tokens";

function cssVarName(segment: string): string {
  return `--crm-${segment}`;
}

function spaceCssVariables(): string {
  return Object.entries(space)
    .map(([key, value]) => `${cssVarName(`space-${String(key)}`)}: ${value};`)
    .join("\n    ");
}

const rootVariables = `
  :root {
    ${cssVarName("grid-gutter")}: ${gridTokens.gutterPx}px;
    ${cssVarName("grid-desktop-width")}: ${gridDesktopInlineSizePx}px;
    ${cssVarName("grid-mobile-margin")}: ${gridTokens.mobile.marginPx}px;

    ${cssVarName("color-accent-primary")}: ${palette.accent.primary};
    ${cssVarName("color-accent-hover")}: ${palette.accent.hover};
    ${cssVarName("color-accent-active")}: ${palette.accent.active};
    ${cssVarName("color-accent-error")}: ${palette.accent.error};
    ${cssVarName("color-accent-success")}: ${palette.accent.success};
    ${cssVarName("color-accent-warning")}: ${palette.accent.warning};
    ${cssVarName("color-text")}: ${palette.neutral.textPrimary};
    ${cssVarName("color-text-secondary")}: ${palette.neutral.textSecondary};
    ${cssVarName("color-disabled")}: ${palette.neutral.disabled};
    ${cssVarName("color-border")}: ${palette.neutral.border};
    ${cssVarName("color-bg-layout")}: ${palette.background.primary};
    ${cssVarName("color-bg-surface")}: ${palette.background.secondary};

    ${cssVarName("font-body")}: ${fonts.body};
    ${cssVarName("font-heading")}: ${fonts.heading};

    ${cssVarName("radius-control")}: ${typeTokens.controlBorderRadiusPx}px;

    ${spaceCssVariables()};
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${rootVariables}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    margin: 0;
    min-height: 100dvh;
    font-family: ${fonts.body};
    font-size: ${typeTokens.body.base.fontSize};
    line-height: ${typeTokens.body.base.lineHeight};
    font-weight: 400;
    color: ${palette.neutral.textPrimary};
    background: ${palette.background.primary};
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  h1,
  h2,
  h3,
  .crm-heading-font {
    font-family: ${fonts.heading};
  }
`;
