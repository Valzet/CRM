import type { ReactNode } from "react";
import {
  AuthGrid,
  AuthRoot,
  BrandColumn,
  BrandFooter,
  BrandLogo,
  BrandMark,
  BrandText,
  FormColumn,
} from "./styled";
import logo from "../../assets/logo/Logo2.png";
const BRAND_COPY =
  "Платформа для управления клиентами, сделками и задачами. Эффективно управляйте бизнес-процессами, отслеживайте ключевые показатели и выстраивайте продуктивные отношения с клиентами.";

type AuthSplitLayoutProps = {
  children: ReactNode;
  leftFooter: ReactNode;
};

export function AuthSplitLayout(props: AuthSplitLayoutProps) {
  const { children, leftFooter } = props;

  return (
    <AuthRoot>
      <AuthGrid>
        <BrandColumn>
          <BrandMark>
            <BrandLogo src={logo} alt="" decoding="async" />
          </BrandMark>
          <BrandText>{BRAND_COPY}</BrandText>
          <BrandFooter>{leftFooter}</BrandFooter>
        </BrandColumn>
        <FormColumn>{children}</FormColumn>
      </AuthGrid>
    </AuthRoot>
  );
}
