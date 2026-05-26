import { Link } from "react-router-dom";
import { TaskStatusCell } from "../../components/tasks/tasks-table.styled";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { TASK_STATUS_META } from "../../lib/task-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { path } from "../../lib/constants/navigation";
import type { Deal, DealStatus, TaskStatus } from "../../types";
import type { Client } from "../../types/client";
import {
  MobileReportCard,
  MobileReportCardFooter,
  MobileReportCardGrid,
  MobileReportCardMeta,
  MobileReportCardNote,
  MobileReportCardRow,
  MobileReportAmount,
  MobileReportCardTitle,
  MobileReportCardTop,
  MobileReportId,
  MobileStageCard,
} from "./reports-mobile-cards.styled";

function formatAmountRub(amount: number) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

function shortId(id: string) {
  return id.length > 14 ? `${id.slice(0, 12)}…` : id;
}

export function SalesReportMobileCard(props: { deal: Deal; clientName: string }) {
  const { deal, clientName } = props;
  return (
    <MobileReportCard>
      <MobileReportCardTop>
        <MobileReportId>id {shortId(deal.id)}</MobileReportId>
        <MobileReportCardMeta>
          {deal.completedAt ? formatDateRu(deal.completedAt) : "—"}
        </MobileReportCardMeta>
      </MobileReportCardTop>
      <MobileReportCardTitle>{deal.title}</MobileReportCardTitle>
      <MobileReportCardMeta>{clientName}</MobileReportCardMeta>
      <MobileReportCardFooter>
        <MobileReportAmount>{formatAmountRub(deal.amount)}</MobileReportAmount>
      </MobileReportCardFooter>
    </MobileReportCard>
  );
}

export function StageReportMobileCard(props: { status: DealStatus; count: number; sum: number }) {
  const { status, count, sum } = props;
  return (
    <MobileStageCard $status={status}>
      <MobileReportCardRow>
        <MobileReportCardTitle>{DEAL_STATUS_META[status]?.label ?? status}</MobileReportCardTitle>
        <MobileReportCardMeta>{count} сделок</MobileReportCardMeta>
      </MobileReportCardRow>
      <MobileReportAmount>{formatAmountRub(sum)}</MobileReportAmount>
    </MobileStageCard>
  );
}

export function NewClientReportMobileCard(props: { client: Client }) {
  const { client } = props;
  return (
    <MobileReportCard>
      <MobileReportCardTop>
        <MobileReportId>id {shortId(client.id)}</MobileReportId>
        <MobileReportCardMeta>{formatDateRu(client.createdAt)}</MobileReportCardMeta>
      </MobileReportCardTop>
      <MobileReportCardTitle>
        <Link to={`${path.clients}/${client.id}/edit`}>{client.name}</Link>
      </MobileReportCardTitle>
      <MobileReportCardMeta>{client.company}</MobileReportCardMeta>
    </MobileReportCard>
  );
}

export function ActivityReportMobileCard(props: {
  id: string;
  name: string;
  deals: number;
  completedTasks: number;
}) {
  const { id, name, deals, completedTasks } = props;
  return (
    <MobileReportCard>
      <MobileReportId>id {shortId(id)}</MobileReportId>
      <MobileReportCardTitle>{name}</MobileReportCardTitle>
      <MobileReportCardGrid>
        <MobileReportCardMeta>
          <strong>{deals}</strong> сделок
        </MobileReportCardMeta>
        <MobileReportCardMeta>
          <strong>{completedTasks}</strong> задач
        </MobileReportCardMeta>
      </MobileReportCardGrid>
    </MobileReportCard>
  );
}

export function OverdueReportMobileCard(props: {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
}) {
  const { id, title, assignee, status, dueDate } = props;
  return (
    <MobileReportCard $overdue>
      <MobileReportCardTop>
        <MobileReportId>id {shortId(id)}</MobileReportId>
        <TaskStatusCell $status={status} style={{ flexShrink: 0 }}>
          {TASK_STATUS_META[status].label}
        </TaskStatusCell>
      </MobileReportCardTop>
      <MobileReportCardTitle>{title}</MobileReportCardTitle>
      <MobileReportCardNote>{assignee}</MobileReportCardNote>
      <MobileReportCardMeta>Ответственный</MobileReportCardMeta>
      <MobileReportCardFooter>
        <MobileReportCardMeta>{formatDateRu(dueDate)}</MobileReportCardMeta>
      </MobileReportCardFooter>
    </MobileReportCard>
  );
}
