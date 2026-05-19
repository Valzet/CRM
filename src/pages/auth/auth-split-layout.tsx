import type { ReactNode } from "react";
import {
  AuthGrid,
  AuthRoot,
  BrandColumn,
  BrandCopy,
  BrandFooter,
  BrandLogo,
  BrandMark,
  BrandName,
  BrandText,
  FormColumn,
} from "./styled";
import logo from "../../assets/logo/Logo2.png";

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
          <BrandCopy>
            <BrandText>Платформа для управления клиентами, сделками и задачами.</BrandText>
            <BrandText>
              Эффективно управляйте бизнес-процессами, отслеживайте ключевые показатели и
              выстраивайте продуктивные отношения с клиентами.
            </BrandText>
          </BrandCopy>
          <BrandFooter>{leftFooter}</BrandFooter>
        </BrandColumn>
        <FormColumn>{children}</FormColumn>
      </AuthGrid>
    </AuthRoot>
  );
}
