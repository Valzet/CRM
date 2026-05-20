import { Input, type InputProps, type InputRef } from "antd";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type UiInputProps = InputProps & {
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
};

export const UiInput = forwardRef<InputRef, UiInputProps>(function UiInput(props, ref) {
  const { prefixIcon, suffixIcon, prefix, suffix, ...rest } = props;

  const mergedPrefix = prefixIcon ?? prefix;
  const mergedSuffix = suffixIcon ?? suffix;

  return <Input ref={ref} prefix={mergedPrefix} suffix={mergedSuffix} {...rest} />;
});

UiInput.displayName = "UiInput";
