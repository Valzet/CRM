import { useLocation } from "react-router-dom";
import closeIcon from "../../assets/icons/24x24/Xmark.svg";
import logoIcon from "../../assets/logo/Logo2.png";
import { path } from "../../lib/constants/navigation";
import { mainNavItems } from "./nav-items";
import {
  MobileBrandIcon,
  MobileBrandLink,
  MobileBrandName,
  MobileBrandYa,
  MobileCloseBtn,
  MobileHeader,
  MobileInner,
  MobileNav,
  MobileNavItem,
  MobileShell,
} from "./mobile-sidebar.styled";

type MobileSidebarProps = {
  onClose: () => void;
  onNavigate?: () => void;
};

export function MobileSidebar({ onClose, onNavigate }: MobileSidebarProps) {
  const { pathname } = useLocation();

  const handleNav = () => {
    onNavigate?.();
    onClose();
  };

  return (
    <MobileShell aria-label="Меню навигации">
      <MobileInner>
        <MobileHeader>
          <MobileBrandLink to={path.welcome} end onClick={handleNav}>
            <MobileBrandIcon src={logoIcon} alt="" decoding="async" />
            <MobileBrandName>
              <MobileBrandYa>Ya</MobileBrandYa>Plex
            </MobileBrandName>
          </MobileBrandLink>
          <MobileCloseBtn type="button" onClick={onClose} aria-label="Закрыть меню">
            <img src={closeIcon} alt="" decoding="async" />
          </MobileCloseBtn>
        </MobileHeader>

        <MobileNav>
          {mainNavItems.map((item) => {
            const isActive = item.matchPrefix
              ? pathname.startsWith(item.matchPrefix)
              : false;

            return (
              <MobileNavItem
                key={item.to}
                to={item.to}
                end={item.end}
                data-active={isActive ? "true" : undefined}
                onClick={handleNav}
              >
                <img src={item.iconSrc} alt="" aria-hidden />
                {item.label}
              </MobileNavItem>
            );
          })}
        </MobileNav>
      </MobileInner>
    </MobileShell>
  );
}
