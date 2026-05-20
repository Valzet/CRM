import { useNavigate } from "react-router-dom";
import {
  MobileCard,
  MobileCardDate,
  MobileCardList,
  MobileCardMeta,
  MobileCardTitle,
  MobileEmpty,
} from "../list-page/mobile-list.styled";
import { formatDateRu } from "../../lib/format/date-ru";
import { TASK_STATUS_META } from "../../lib/task-status";
import { path } from "../../lib/constants/navigation";
import { color } from "../../theme/tokens";
import styled from "styled-components";
import type { Task } from "../../types";

const TaskFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
`;

const TaskStatus = styled.span<{ $status: Task["status"] }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "completed") return color.accent.success;
    return color.neutral.textSecondary;
  }};
`;

type Props = {
  tasks: Task[];
  dealTitleById: (id: string) => string;
};

export function TasksMobileList({ tasks, dealTitleById }: Props) {
  const navigate = useNavigate();

  if (!tasks.length) {
    return <MobileEmpty>Задачи не найдены</MobileEmpty>;
  }

  return (
    <MobileCardList>
      {tasks.map((task) => (
        <MobileCard
          key={task.id}
          onClick={() => navigate(`${path.tasks}/${task.id}/edit`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`${path.tasks}/${task.id}/edit`);
            }
          }}
        >
          <MobileCardTitle>{task.title}</MobileCardTitle>
          <MobileCardMeta>сделка {dealTitleById(task.dealId)}</MobileCardMeta>
          <TaskFooter>
            <MobileCardDate>до {formatDateRu(task.dueDate)}</MobileCardDate>
            <TaskStatus $status={task.status}>{TASK_STATUS_META[task.status].label}</TaskStatus>
          </TaskFooter>
        </MobileCard>
      ))}
    </MobileCardList>
  );
}
