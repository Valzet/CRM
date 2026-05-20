import { grid } from "../theme/tokens";
import { useMediaQuery } from "./use-media-query";

/** Макеты: ширина 375px; breakpoint — до 767px. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${grid.breakpoints.mobileMax})`);
}
