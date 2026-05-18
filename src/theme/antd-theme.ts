import type { ThemeConfig } from "antd";
import { color, fontFamilies, typography } from "./tokens";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: color.accent.primary,
    colorPrimaryHover: color.accent.hover,
    colorPrimaryActive: color.accent.active,
    colorError: color.accent.error,
    colorSuccess: color.accent.success,
    colorWarning: color.accent.warning,
    colorTextBase: color.neutral.textPrimary,
    colorText: color.neutral.textPrimary,
    colorTextSecondary: color.neutral.textSecondary,
    colorTextPlaceholder: color.neutral.textSecondary,
    colorTextDisabled: color.neutral.disabled,
    colorBorder: color.neutral.border,
    colorBorderSecondary: color.neutral.border,
    colorBgLayout: color.background.primary,
    colorBgContainer: color.background.secondary,
    colorBgElevated: color.background.secondary,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    fontSizeLG: 16,
    lineHeight: 1.5,
    borderRadius: typography.controlBorderRadiusPx,
    controlHeight: 40,
    paddingContentHorizontal: 16,
    paddingXS: 8,
  },
  components: {
    Button: {
      fontWeight: 500,
      defaultShadow: "none",
      primaryShadow: "none",
      dangerShadow: "none",
    },
    Checkbox: {
      controlInteractiveSize: 18,
      borderRadiusSM: typography.controlBorderRadiusPx,
    },
    Input: {
      paddingInline: 12,
      paddingBlock: 8,
      activeShadow: "none",
    },
  },
};
