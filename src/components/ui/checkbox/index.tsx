import { Checkbox, type CheckboxProps } from "antd";

export type UiCheckboxProps = CheckboxProps;

export function UiCheckbox(props: UiCheckboxProps) {
  return <Checkbox {...props} />;
}

UiCheckbox.displayName = "UiCheckbox";
