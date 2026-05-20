import { Table } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClientCardModal,
  ClientCreateModal,
  ClientsMobileList,
  ClientsTableWrap,
} from "../../components/clients";
import {
  CellLink,
  ListPageError,
  ListPageLoading,
  ListPageStickyAction,
  ListPageToolbar,
  PageHeading,
  PageRoot,
} from "../../components/list-page";
import { useIsMobile } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { formatDateRu } from "../../lib/format/date-ru";
import { formatPhoneRu } from "../../lib/format/phone-ru";
import { useGetClientsQuery } from "../../store/api";
import type { Client } from "../../types";

function clientMatchesQuery(c: Client, needle: string) {
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const hay = [
    c.name,
    c.phone ?? "",
    formatPhoneRu(c.phone),
    c.email ?? "",
    c.company ?? "",
    c.website ?? "",
    c.comment ?? "",
    c.createdAt ?? "",
    formatDateRu(c.createdAt),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function ClientsListPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery({ includeDeleted: true });
  const [q, setQ] = useState("");
  const [cardId, setCardId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filtered = useMemo(() => clients.filter((c) => clientMatchesQuery(c, q)), [clients, q]);

  if (isLoading) return <ListPageLoading />;

  if (isError) {
    return (
      <ListPageError
        title="Клиенты"
        message="Не удалось загрузить данные"
        description={
          error && "status" in error
            ? "Убедитесь, что json-server запущен: npm run server"
            : "Проверьте сеть и прокси Vite (/api → localhost:3001)."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const openCreate = () => {
    if (isMobile) {
      navigate(`${path.clients}/new`);
      return;
    }
    setCreateOpen(true);
  };

  return (
    <PageRoot $mobileStickyFooter={isMobile}>
      <PageHeading>Клиенты</PageHeading>

      <ListPageToolbar
        createLabel="Новый клиент"
        onCreate={openCreate}
        searchValue={q}
        onSearchChange={setQ}
      />

      {isMobile ? (
        <ClientsMobileList clients={filtered} />
      ) : (
        <ClientsTableWrap>
          <Table<Client>
            rowKey="id"
            size="middle"
            pagination={false}
            dataSource={filtered}
            rowClassName={(record) => (record.deleted ? "row-deleted" : "")}
            onRow={(record) => ({
              onClick: () => setCardId(record.id),
              style: { cursor: "pointer" },
            })}
            columns={[
              {
                title: "Имя",
                dataIndex: "name",
                sorter: (a, b) => a.name.localeCompare(b.name),
              },
              {
                title: "Телефон",
                dataIndex: "phone",
                sorter: (a, b) => (a.phone ?? "").localeCompare(b.phone ?? ""),
                render: (v: string) => formatPhoneRu(v),
              },
              {
                title: "Email",
                dataIndex: "email",
                sorter: (a, b) => (a.email ?? "").localeCompare(b.email ?? ""),
                render: (v: string) =>
                  v ? (
                    <CellLink href={`mailto:${v}`} onClick={(e) => e.stopPropagation()}>
                      {v}
                    </CellLink>
                  ) : (
                    "—"
                  ),
              },
              {
                title: "Название компании",
                dataIndex: "company",
                sorter: (a, b) => a.company.localeCompare(b.company),
              },
              {
                title: "Сайт",
                dataIndex: "website",
                sorter: (a, b) => (a.website ?? "").localeCompare(b.website ?? ""),
                render: (w: string) =>
                  w ? (
                    <CellLink
                      href={w.startsWith("http") ? w : `https://${w}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {displayWebsite(w)}
                    </CellLink>
                  ) : (
                    "—"
                  ),
              },
              {
                title: "Комментарий",
                dataIndex: "comment",
                ellipsis: true,
                sorter: (a, b) => (a.comment ?? "").localeCompare(b.comment ?? ""),
              },
              {
                title: "Добавлен",
                dataIndex: "createdAt",
                align: "right",
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                render: (v: string) => formatDateRu(v),
              },
            ]}
          />
        </ClientsTableWrap>
      )}

      {isMobile ? <ListPageStickyAction label="Новый клиент" onClick={openCreate} /> : null}

      {!isMobile ? (
        <>
          <ClientCardModal
            clientId={cardId}
            open={cardId !== null}
            onClose={() => setCardId(null)}
          />
          <ClientCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
      ) : null}
    </PageRoot>
  );
}
