import { Button, type ButtonProps } from "antd";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export type UiButtonProps = ButtonProps & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

function resolvedIconPlacement(
  leadingIcon: UiButtonProps["leadingIcon"],
  trailingIcon: UiButtonProps["trailingIcon"],
  icon: UiButtonProps["icon"],
  explicit: UiButtonProps["iconPlacement"],
): ButtonProps["iconPlacement"] | undefined {
  if (explicit) return explicit;
  const hasBothCustom = Boolean(leadingIcon && trailingIcon) && icon === undefined;
  if (hasBothCustom) return undefined;

  const single = icon ?? leadingIcon ?? trailingIcon;
  if (!single) return undefined;
  if (icon !== undefined && icon !== null) return undefined;

  return trailingIcon && !leadingIcon ? "end" : "start";
}

export const UiButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, UiButtonProps>(
  function UiButton(props, ref) {
    const { leadingIcon, trailingIcon, icon, iconPlacement, children, ...rest } = props;

    const hasDualRow = Boolean(
      leadingIcon && trailingIcon && (icon === undefined || icon === null),
    );

    if (hasDualRow) {
      return (
        <Button ref={ref} {...rest}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--crm-space-2)",
            }}
          >
            {leadingIcon}
            {children}
            {trailingIcon}
          </span>
        </Button>
      );
    }

    const mergedIcon = icon ?? leadingIcon ?? trailingIcon ?? undefined;
    const mergedPlacement = resolvedIconPlacement(leadingIcon, trailingIcon, icon, iconPlacement);

    return (
      <Button
        ref={ref}
        {...rest}
        icon={mergedIcon ?? undefined}
        iconPlacement={mergedIcon === undefined ? undefined : (mergedPlacement ?? "start")}
      >
        {children}
      </Button>
    );
  },
);

UiButton.displayName = "UiButton";
