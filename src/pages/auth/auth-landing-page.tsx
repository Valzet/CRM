import { Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/Logo2.png";
import { path } from "../../lib/constants/navigation";
import {
  AuthRoot,
  LandingActions,
  LandingBrandMark,
  LandingBrandName,
  LandingBrandYa,
  LandingCopy,
  LandingInner,
  LandingLogo,
  LandingText,
} from "./styled";

export function AuthLandingPage() {
  return (
    <AuthRoot>
      <LandingInner>
        <LandingBrandMark>
          <LandingLogo src={logo} alt="" decoding="async" />
          <LandingBrandName>
            <LandingBrandYa>Ya</LandingBrandYa>Plex
          </LandingBrandName>
        </LandingBrandMark>
        <LandingCopy>
          <LandingText>
            Платформа для управления клиентами, сделками и задачами. Эффективно управляйте
            бизнес-процессами, отслеживайте ключевые показатели и выстраивайте продуктивные
            отношения с клиентами.
          </LandingText>
        </LandingCopy>
        <LandingActions>
          <Link to={path.login}>
            <Button type="primary" block size="large">
              Войти
            </Button>
          </Link>
          <Link to={path.register}>
            <Button block size="large">
              Регистрация
            </Button>
          </Link>
        </LandingActions>
      </LandingInner>
    </AuthRoot>
  );
}
