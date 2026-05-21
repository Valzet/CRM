import { Button } from "antd";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/logo/Full.png";
import { path } from "../../lib/constants/navigation";
import {
  AuthRoot,
  LandingActions,
  LandingBrandMark,
  LandingBrandName,
  LandingBrandYa,
  LandingInner,
  LandingLogo,
  LandingText,
} from "./styled";

export function AuthLandingPage() {
  return (
    <AuthRoot>
      <LandingInner>
        <LandingBrandMark>
          <LandingLogo src={logoIcon} alt="" decoding="async" />
          <LandingBrandName>
            <LandingBrandYa>Ya</LandingBrandYa>Plex
          </LandingBrandName>
        </LandingBrandMark>
        <LandingText>
          Платформа для управления клиентами, сделками и задачами. Эффективно управляйте
          бизнес-процессами, отслеживайте ключевые показатели и выстраивайте продуктивные
          отношения с клиентами.
        </LandingText>
        <LandingActions>
          <Link to={path.login} state={{ showForm: true }}>
            <Button type="primary" block size="large">
              Войти
            </Button>
          </Link>
          <Link to={path.register}>
            <Button block size="large" variant="outlined">
              Регистрация
            </Button>
          </Link>
        </LandingActions>
      </LandingInner>
    </AuthRoot>
  );
}
