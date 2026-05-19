import { Checkbox, type CheckboxProps } from "antd";

export type UiCheckboxProps = CheckboxProps;

/**
 * Обертка над Ant Design `Checkbox` под дизайн-систему.
 *
 * Иконку и подпись:
 * — текст и картинки передаются в **`children`** (например, инлайн‑SVG или `<img alt="" />` рядом с текстом).
 * — состояние квадратика галочки задаёт тема Ant (`antdTheme` в `src/theme/antd-theme.ts`).
 */
export function UiCheckbox(props: UiCheckboxProps) {
  return <Checkbox {...props} />;
}

UiCheckbox.displayName = "UiCheckbox";
