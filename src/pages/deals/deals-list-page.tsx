import { Table } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DealCardModal,
  DealCreateModal,
  DealsMobileList,
  DealStatusCell,
  DealTitleCell,
  DealsTableWrap,
  dealRowClassName,
} from "../../components/deals";
import {
  ListPageError,
  ListPageLoading,
  ListPageStickyAction,
  ListPageToolbar,
  PageHeading,
  PageRoot,
} from "../../components/list-page";
import { useIsMobile } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { formatMoneyRu } from "../../lib/format/money-ru";
import { useGetClientsQuery, useGetDealsQuery } from "../../store/api";
import type { Deal } from "../../types";

export function DealsListPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: deals = [], isLoading, isError, error, refetch } = useGetDealsQuery();
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true });
  const [q, setQ] = useState("");
  const [cardId, setCardId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return deals;
    return deals.filter((d) => {
      const cn = (clients.find((c) => c.id === d.clientId)?.name ?? "—").toLowerCase();
      const statusLabel = (DEAL_STATUS_META[d.status]?.label ?? d.status).toLowerCase();
      const hay = [
        d.title,
        d.description,
        String(d.amount),
        d.status,
        statusLabel,
        cn,
        d.createdAt,
        formatDateRu(d.createdAt),
        d.completedAt ? formatDateRu(d.completedAt) : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [deals, q, clients]);

  const nameByClientId = (id: string) => clients.find((c) => c.id === id)?.name ?? "—";

  if (isLoading) return <ListPageLoading />;

  if (isError) {
    return (
      <ListPageError
        title="Сделки"
        message="Не удалось загрузить сделки"
        description={
          error && "status" in error ? "Запустите json-server: npm run server" : "Проверьте сеть."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const openCreate = () => {
    if (isMobile) {
      navigate(`${path.deals}/new`);
      return;
    }
    setCreateOpen(true);
  };

  return (
    <PageRoot $mobileStickyFooter={isMobile}>
      <PageHeading>Сделки</PageHeading>

      <ListPageToolbar
        createLabel="Новая сделка"
        onCreate={openCreate}
        searchValue={q}
        onSearchChange={setQ}
      />

      {isMobile ? (
        <DealsMobileList deals={filtered} clientNameById={nameByClientId} />
      ) : (
      <DealsTableWrap>
        <Table<Deal>
          rowKey="id"
          size="middle"
          pagination={false}
          dataSource={filtered}
          rowClassName={(record) => dealRowClassName(record.status)}
          onRow={(record) => ({
            onClick: () => setCardId(record.id),
            style: { cursor: "pointer" },
          })}
          columns={[
            {
              title: "Название",
              dataIndex: "title",
              sorter: (a, b) => a.title.localeCompare(b.title),
              render: (t: string) => <DealTitleCell>{t}</DealTitleCell>,
            },
            {
              title: "Клиент",
              key: "client",
              sorter: (a, b) =>
                nameByClientId(a.clientId).localeCompare(nameByClientId(b.clientId)),
              render: (_, row) => nameByClientId(row.clientId),
            },
            {
              title: "Описание",
              dataIndex: "description",
              ellipsis: true,
              sorter: (a, b) => a.description.localeCompare(b.description),
            },
            {
              title: "Этап (статус)",
              dataIndex: "status",
              sorter: (a, b) => a.status.localeCompare(b.status),
              render: (s: Deal["status"]) => (
                <DealStatusCell $status={s}>{DEAL_STATUS_META[s].label}</DealStatusCell>
              ),
            },
            {
              title: "Сумма",
              dataIndex: "amount",
              sorter: (a, b) => a.amount - b.amount,
              render: (v: number) => formatMoneyRu(v),
            },
            {
              title: "Дата создания",
              dataIndex: "createdAt",
              sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
              render: (v: string) => formatDateRu(v),
            },
            {
              title: "Дата завершения",
              dataIndex: "completedAt",
              sorter: (a, b) => (a.completedAt ?? "").localeCompare(b.completedAt ?? ""),
              render: (v: string | undefined) => (v ? formatDateRu(v) : "—"),
            },
          ]}
        />
      </DealsTableWrap>
      )}

      {isMobile ? <ListPageStickyAction label="Новая сделка" onClick={openCreate} /> : null}

      {!isMobile ? (
        <>
          <DealCardModal dealId={cardId} open={cardId !== null} onClose={() => setCardId(null)} />
          <DealCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
      ) : null}
    </PageRoot>
  );
}
