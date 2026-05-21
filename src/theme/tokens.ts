export const grid = {
  breakpoints: {
    mobileMax: "767px",
    desktopMin: "768px",
  },
  gutterPx: 20,
  desktop: {
    columns: 12,

    columnWidthPx: 80,
    alignment: "center" as const,
  },
  mobile: {
    /**ширина из фигмы моб версии */
    designWidthPx: 375,
    columns: 4,
    alignment: "stretch" as const,
    marginPx: 20,
  },
} as const;

export const gridDesktopInlineSizePx =
  grid.desktop.columns * grid.desktop.columnWidthPx + (grid.desktop.columns - 1) * grid.gutterPx;

export const layout = {
  headerMinHeightPx: 56,
  sidebarExpandedPx: 260,
  sidebarCollapsedPx: 72,
  sidebarItemHeightPx: 44,
  /** padding 12 + кнопка 48 + padding 12 (без safe-area и border) */
  mobileStickyBarPx: 72,
  /** Доп. зазор между последней карточкой и фиксированной панелью */
  mobileStickyFooterGapPx: 8,
  mobileScrollPaddingBottomPx: 100,

  navItemMutedBg: "#F4F4F4",
} as const;

/** CSS-выражение высоты фиксированной нижней панели + зазор (для spacer и padding). */
export const cssMobileStickyFooterClearance = `calc(61px + max(12px, env(safe-area-inset-bottom, 0px)) + ${layout.mobileStickyFooterGapPx}px)`;

export const color = {
  accent: {
    primary: "#3B82F6",
    hover: "#2563EB",
    active: "#1D4ED8",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  neutral: {
    textPrimary: "#1F2937",
    textHover: "#4B5563",
    textSecondary: "#6B7280",
    disabled: "#9CA3AF",
    border: "#D1D5DB",
  },
  background: {
    primary: "#F3F4F6",
    secondary: "#FFFFFF",
    shadowHint: "#E5E7EB",
    success: "#F0FDF4",
    error: "#FEF2F2",
    warning: "#FFF7ED",
    info: "#EFF6FF",
    limeTint: "#F7FEE7",
  },
} as const;

export const fontFamilies = {
  heading: `'Roboto', system-ui, sans-serif`,
  body: `'Inter', system-ui, sans-serif`,
} as const;

export const typography = {
  heading: {
    h1: { fontSize: "30px", lineHeight: "36px", fontWeight: 700 },
    h2: { fontSize: "24px", lineHeight: "32px", fontWeight: 700 },
    h3: { fontSize: "20px", lineHeight: "28px", fontWeight: 700 },
    h3Mobile: { fontSize: "16px", lineHeight: "24px", fontWeight: 700 },
  },
  body: {
    base: { fontSize: "16px", lineHeight: "24px" },
    sm: { fontSize: "14px", lineHeight: "20px" },
    xs: { fontSize: "12px", lineHeight: "16px", fontWeight: 400 },
  },

  controlBorderRadiusPx: 6,
} as const;

export const space = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
} as const;

export type SpaceKey = keyof typeof space;
