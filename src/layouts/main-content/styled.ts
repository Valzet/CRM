import styled from "styled-components";
import { Layout } from "antd";

const { Content } = Layout;

export const StyledLayout = styled(Content)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  height: 100%;
  overflow: hidden;
`;
