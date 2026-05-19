import { Input, type InputProps, type InputRef } from "antd";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type UiInputProps = InputProps & {
  /**
   * Префикс слева (лупа и т. д.) → пробрасывается в `prefix`.
   */
  prefixIcon?: ReactNode;
  /** Содержимое справа → `suffix`. */
  suffixIcon?: ReactNode;
};

/**
 * Обычный `Input` из Ant Design с явными точками для иконок.
 *
 * Замещение родных `prefix` / `suffix`: если задан `prefixIcon` / `suffixIcon`,
 * они побеждают одноимённые props после мёрджа (сначала ваш слот).
 */
export const UiInput = forwardRef<InputRef, UiInputProps>(function UiInput(props, ref) {
  const { prefixIcon, suffixIcon, prefix, suffix, ...rest } = props;

  const mergedPrefix = prefixIcon ?? prefix;
  const mergedSuffix = suffixIcon ?? suffix;

  return <Input ref={ref} prefix={mergedPrefix} suffix={mergedSuffix} {...rest} />;
});

UiInput.displayName = "UiInput";
