import styled from "styled-components";
import { Radio } from "antd";
import { color, grid } from "../../theme/tokens";

export const ContentWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  max-height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  background-color: ${color.background.primary};
  overflow: hidden;
  overflow-y: auto;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    padding: 0 ${grid.mobile.marginPx}px;
    background-color: ${color.background.secondary};
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  text-align: center;
  position: relative;
  padding-top: 5px;
`;

export const ViewTitle = styled.div`
  align-self: center;
  margin: 0;
  padding: 10px 0;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;

  position: absolute;
  text-transform: uppercase;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 20;
`;
export const SelectedRadio = styled(Radio)``;

export const RegistrationButton = styled.button`
  width: 150px;
  height: 30px;
  border-radius: 6px;
  position: absolute;
  background-color: rgba(0, 111, 186, 1);
  right: 0;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 21;

  ::after {
    content: "+";
    padding-left: 8px;
  }
`;
