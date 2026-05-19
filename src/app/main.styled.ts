import styled from "styled-components";
import { color } from "../theme/tokens";

const Shell = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  min-height: 100dvh;
`;

const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

const MobileBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: ${color.background.secondary};
  border-bottom: 1px solid ${color.background.shadowHint};
  flex-shrink: 0;
`;

export { Shell, MainPane, MobileBar };