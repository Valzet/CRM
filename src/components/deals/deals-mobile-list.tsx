import { useNavigate } from "react-router-dom";
import {
  MobileCard,
  MobileCardDate,
  MobileCardList,
  MobileCardMeta,
  MobileCardTitle,
  MobileCardTop,
  MobileEmpty,
} from "../list-page/mobile-list.styled";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { formatMoneyRu } from "../../lib/format/money-ru";
import { path } from "../../lib/constants/navigation";
import { color } from "../../theme/tokens";
import styled from "styled-components";
import type { Deal } from "../../types";

const DealFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
`;

const DealAmount = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

const DealStatus = styled.span<{ $status: Deal["status"] }>`
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "completed") return color.accent.success;
    if (p.$status === "cancelled") return color.accent.warning;
    return color.neutral.textSecondary;
  }};
`;

type Props = {
  deals: Deal[];
  clientNameById: (id: string) => string;
};

export function DealsMobileList({ deals, clientNameById }: Props) {
  const navigate = useNavigate();

  if (!deals.length) {
    return <MobileEmpty>Сделки не найдены</MobileEmpty>;
  }

  return (
    <MobileCardList>
      {deals.map((deal) => (
        <MobileCard
          key={deal.id}
          onClick={() => navigate(`${path.deals}/${deal.id}/edit`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`${path.deals}/${deal.id}/edit`);
            }
          }}
        >
          <MobileCardTop>
            <MobileCardTitle>{deal.title}</MobileCardTitle>
            <DealStatus $status={deal.status}>{DEAL_STATUS_META[deal.status].label}</DealStatus>
          </MobileCardTop>
          <MobileCardMeta>{clientNameById(deal.clientId)}</MobileCardMeta>
          <DealFooter>
            <DealAmount>{formatMoneyRu(deal.amount)}</DealAmount>
            <MobileCardDate>{formatDateRu(deal.createdAt)}</MobileCardDate>
          </DealFooter>
        </MobileCard>
      ))}
    </MobileCardList>
  );
}
