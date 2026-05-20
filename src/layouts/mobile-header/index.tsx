import barsIcon from "../../assets/icons/24x24/Bars.svg";
import userIcon from "../../assets/icons/24x24/User.svg";
import logoImg from "../../assets/logo/Logo4.png";
import { path } from "../../lib/constants/navigation";
import { Bar, CenterLink, IconBtn, LogoImg, ProfileLink, SideSlot } from "./mobile-header.styled";

type MobileHeaderProps = {
  onMenuOpen: () => void;
};

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  return (
    <Bar>
      <SideSlot>
        <IconBtn type="button" onClick={onMenuOpen} aria-label="Открыть меню">
          <img src={barsIcon} alt="" decoding="async" />
        </IconBtn>
      </SideSlot>
      <CenterLink to={path.welcome} aria-label="На главную">
        <LogoImg src={logoImg} alt="YaPlex" decoding="async" />
      </CenterLink>
      <SideSlot>
        <ProfileLink to={path.settings} aria-label="Профиль">
          <img src={userIcon} alt="" decoding="async" />
        </ProfileLink>
      </SideSlot>
    </Bar>
  );
}
