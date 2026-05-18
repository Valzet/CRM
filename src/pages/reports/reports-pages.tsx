import { Button, Select, Space, Table, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEAL_STATUS_META } from '../../lib/deal-status'
import { isoTimestampInRange } from '../../lib/date/periods'
import { formatDateRu } from '../../lib/format/date-ru'
import { TASK_STATUS_META } from '../../lib/task-status'
import { path } from '../../lib/constants/navigation'
import {
  useGetClientsQuery,
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
} from '../../store/api'
import type { Deal, DealStatus } from '../../types'
import type { Client } from '../../types/client'
import type { ReportPreset } from './report-period'
import { rangeForPreset } from './report-period'

type ClientReportRow = Client & { key: string }

const PRESET_OPTS: { value: ReportPreset; label: string }[] = [
  { value: 'week', label: 'Текущая неделя' },
  { value: 'month', label: 'Текущий месяц' },
  { value: 'quarter', label: 'Текущий квартал' },
  { value: 'all', label: 'Всё время' },
]

const DEAL_STATUS_OPTS: { value: DealStatus; label: string }[] = (
  ['new', 'in_progress', 'completed', 'cancelled'] satisfies DealStatus[]
).map((s) => ({ value: s, label: DEAL_STATUS_META[s].label }))

const tablePaging = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (t: number) => `Записей: ${t}`,
} as const

function managersDealMatch(d: Deal, managerIds: string[]) {
  return managerIds.length === 0 || managerIds.includes(d.createdBy)
}

function statusesDealMatch(d: Deal, statuses: DealStatus[]) {
  return statuses.length === 0 || statuses.includes(d.status)
}

function Toolbar(props: {
  preset: ReportPreset
  onPreset: (v: ReportPreset) => void
  managerIds: string[]
  onManagers: (v: string[]) => void
  dealStatuses: DealStatus[]
  onStatuses: (v: DealStatus[]) => void
  users: { id: string; name: string }[]
}) {
  const {
    preset,
    onPreset,
    managerIds,
    onManagers,
    dealStatuses,
    onStatuses,
    users,
  } = props

  return (
    <Space wrap align='center' style={{ marginBottom: 16, width: '100%' }}>
      <Typography.Text type='secondary'>Период</Typography.Text>
      <Select
        style={{ minWidth: 180 }}
        value={preset}
        onChange={(v: ReportPreset) => onPreset(v)}
        options={PRESET_OPTS}
      />
      <Typography.Text type='secondary'>Менеджеры</Typography.Text>
      <Select
        mode='multiple'
        allowClear
        placeholder='Все менеджеры'
        style={{ minWidth: 220 }}
        value={managerIds}
        onChange={onManagers}
        options={users.map((u) => ({ value: u.id, label: u.name }))}
      />
      <Typography.Text type='secondary'>Этапы сделок</Typography.Text>
      <Select
        mode='multiple'
        allowClear
        placeholder='Все этапы'
        style={{ minWidth: 200 }}
        value={dealStatuses}
        onChange={onStatuses}
        options={DEAL_STATUS_OPTS}
      />
      <Typography.Text type='secondary' title='Не реализовано для мок-сервера'>
        Экспорт PDF/XLSX — заглушка
      </Typography.Text>
      <Button disabled size='small'>
        PDF
      </Button>
      <Button disabled size='small'>
        XLSX
      </Button>
    </Space>
  )
}

function dealCompletionIso(d: Deal) {
  return d.completedAt ?? d.createdAt
}

export function ReportsSalesPage() {
  const { data: deals = [] } = useGetDealsQuery()
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true })
  const { data: users = [] } = useGetUsersQuery()

  const [preset, setPreset] = useState<ReportPreset>('month')
  const [managerIds, setManagerIds] = useState<string[]>([])
  const [dealStatuses, setDealStatuses] = useState<DealStatus[]>([])

  const { start, end } = rangeForPreset(preset)

  const completedRows = useMemo(() => {
    return deals
      .filter((d) => d.status === 'completed')
      .filter((d) => managersDealMatch(d, managerIds))
      .filter((d) =>
        isoTimestampInRange(dealCompletionIso(d), start, end),
      )
      .map((d) => ({
        key: d.id,
        deal: d,
        clientName:
          clients.find((c) => c.id === d.clientId)?.name ?? '—',
      }))
  }, [deals, clients, managerIds, start, end])

  const stagesRows = useMemo(() => {
    const map = new Map<string, { count: number; sum: number }>()
    for (const d of deals) {
      if (!managersDealMatch(d, managerIds)) continue
      if (!statusesDealMatch(d, dealStatuses)) continue
      if (!isoTimestampInRange(d.createdAt, start, end)) continue
      const cur = map.get(d.status) ?? { count: 0, sum: 0 }
      cur.count += 1
      cur.sum += d.amount
      map.set(d.status, cur)
    }
    return [...map.entries()].map(([status, { count, sum }]) => ({
      key: status,
      status,
      count,
      sum,
    }))
  }, [deals, managerIds, dealStatuses, start, end])

  return (
    <div>
      <Toolbar
        preset={preset}
        onPreset={setPreset}
        managerIds={managerIds}
        onManagers={setManagerIds}
        dealStatuses={dealStatuses}
        onStatuses={setDealStatuses}
        users={users}
      />

      <Typography.Title level={4}>Общий отчёт по продажам</Typography.Title>
      <Typography.Paragraph type='secondary' style={{ marginTop: 0 }}>
        Завершённые сделки за выбранный период (по дате завершения).
      </Typography.Paragraph>
      <Table
        size='small'
        pagination={tablePaging}
        dataSource={completedRows}
        columns={[
          {
            title: 'ID сделки',
            key: 'id',
            sorter: (a, b) => a.deal.id.localeCompare(b.deal.id),
            render: (_, row) => row.deal.id,
            ellipsis: true,
            width: 120,
          },
          {
            title: 'Название',
            key: 'title',
            sorter: (a, b) => a.deal.title.localeCompare(b.deal.title),
            render: (_, row) => row.deal.title,
          },
          {
            title: 'Клиент',
            dataIndex: 'clientName',
            sorter: (a, b) => a.clientName.localeCompare(b.clientName),
          },
          {
            title: 'Сумма',
            key: 'amount',
            sorter: (a, b) => a.deal.amount - b.deal.amount,
            render: (_, row) =>
              `${row.deal.amount.toLocaleString('ru-RU')} ₽`,
          },
          {
            title: 'Дата завершения',
            key: 'completed',
            sorter: (a, b) =>
              dealCompletionIso(a.deal).localeCompare(
                dealCompletionIso(b.deal),
              ),
            render: (_, row) =>
              row.deal.completedAt
                ? formatDateRu(row.deal.completedAt)
                : '—',
          },
        ]}
      />

      <Typography.Title level={4} style={{ marginTop: 32 }}>
        Отчёт по этапам сделок
      </Typography.Title>
      <Typography.Paragraph type='secondary' style={{ marginTop: 0 }}>
        Сделки, созданные в выбранном периоде, с учётом менеджеров и этапов.
      </Typography.Paragraph>
      <Table
        size='small'
        pagination={tablePaging}
        dataSource={stagesRows}
        columns={[
          {
            title: 'Этап сделки',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (s: string) => DEAL_STATUS_META[s as DealStatus]?.label ?? s,
          },
          {
            title: 'Количество сделок на этапе',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
          },
          {
            title: 'Общая сумма сделок на этапе',
            dataIndex: 'sum',
            sorter: (a, b) => a.sum - b.sum,
            render: (v: number) => `${v.toLocaleString('ru-RU')} ₽`,
          },
        ]}
      />
    </div>
  )
}

export function ReportsClientsPage() {
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true })
  const { data: deals = [] } = useGetDealsQuery()
  const { data: tasks = [] } = useGetTasksQuery()
  const { data: users = [] } = useGetUsersQuery()

  const [preset, setPreset] = useState<ReportPreset>('month')
  const [managerIds, setManagerIds] = useState<string[]>([])
  const [dealStatuses, setDealStatuses] = useState<DealStatus[]>([])

  const { start, end } = rangeForPreset(preset)

  const dealsInFilter = useMemo(
    () =>
      deals
        .filter((d) => managersDealMatch(d, managerIds))
        .filter((d) => statusesDealMatch(d, dealStatuses)),
    [deals, managerIds, dealStatuses],
  )

  const newClientsRows = useMemo(() => {
    return [...clients]
      .filter((c) => !c.deleted)
      .filter(
        (c) =>
          managerIds.length === 0 || managerIds.includes(c.createdBy),
      )
      .filter((c) => isoTimestampInRange(c.createdAt, start, end))
      .map((c) => ({ ...c, key: c.id }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [clients, managerIds, start, end])

  const activityRows = useMemo(() => {
    return clients.map((c) => {
      const ds = dealsInFilter.filter((d) => d.clientId === c.id)
      const taskDealSet = new Set(ds.map((d) => d.id))
      const doneTasks = tasks.filter(
        (t) =>
          taskDealSet.has(t.dealId) &&
          t.status === 'completed' &&
          (managerIds.length === 0 ||
            managerIds.includes(t.assigneeId)),
      )

      return {
        key: c.id,
        id: c.id,
        name: c.name,
        deals: ds.length,
        completedTasks: doneTasks.length,
      }
    })
  }, [clients, dealsInFilter, tasks, managerIds])

  return (
    <div>
      <Toolbar
        preset={preset}
        onPreset={setPreset}
        managerIds={managerIds}
        onManagers={setManagerIds}
        dealStatuses={dealStatuses}
        onStatuses={setDealStatuses}
        users={users}
      />

      <Typography.Title level={4}>Отчёт по новым клиентам</Typography.Title>
      <Typography.Paragraph type='secondary' style={{ marginTop: 0 }}>
        Клиенты с датой добавления в периоде (по автору записи среди менеджеров).
      </Typography.Paragraph>
      <Table<ClientReportRow>
        size='small'
        pagination={tablePaging}
        dataSource={newClientsRows}
        columns={[
          {
            title: 'ID клиента',
            dataIndex: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            ellipsis: true,
            width: 120,
          },
          {
            title: 'Имя клиента',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (t: string, row: { id: string }) => (
              <Link to={`${path.clients}/${row.id}/edit`}>{t}</Link>
            ),
          },
          {
            title: 'Компания',
            dataIndex: 'company',
            sorter: (a, b) => a.company.localeCompare(b.company),
          },
          {
            title: 'Дата добавления',
            dataIndex: 'createdAt',
            sorter: (a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            render: (v: string) => formatDateRu(v),
          },
        ]}
      />

      <Typography.Title level={4} style={{ marginTop: 32 }}>
        Отчёт по активности клиентов
      </Typography.Title>
      <Typography.Paragraph type='secondary' style={{ marginTop: 0 }}>
        По сделкам в фильтрах и завершённым задачам по связанным сделкам
        (исполнитель среди выбранных менеджеров).
      </Typography.Paragraph>
      <Table
        size='small'
        pagination={tablePaging}
        dataSource={activityRows}
        columns={[
          {
            title: 'ID клиента',
            dataIndex: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
          },
          {
            title: 'Имя клиента',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: 'Количество сделок',
            dataIndex: 'deals',
            sorter: (a, b) => a.deals - b.deals,
          },
          {
            title: 'Завершённые задачи',
            dataIndex: 'completedTasks',
            sorter: (a, b) => a.completedTasks - b.completedTasks,
          },
        ]}
      />
    </div>
  )
}

export function ReportsTasksPage() {
  const { data: tasks = [] } = useGetTasksQuery()
  const { data: deals = [] } = useGetDealsQuery()
  const { data: users = [] } = useGetUsersQuery()

  const [preset, setPreset] = useState<ReportPreset>('month')
  const [managerIds, setManagerIds] = useState<string[]>([])
  const [dealStatuses, setDealStatuses] = useState<DealStatus[]>([])

  const { start, end } = rangeForPreset(preset)

  const overdue = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.status === 'completed') return false
        return new Date(t.dueDate) < new Date()
      })
      .filter((t) =>
        isoTimestampInRange(t.dueDate, start, end),
      )
      .filter(
        (t) =>
          managerIds.length === 0 ||
          managerIds.includes(t.assigneeId),
      )
      .filter((t) => {
        const deal = deals.find((d) => d.id === t.dealId)
        if (!deal) return true
        return (
          statusesDealMatch(deal, dealStatuses)
        )
      })
      .map((t) => ({
        key: t.id,
        ...t,
        dealTitle: deals.find((d) => d.id === t.dealId)?.title ?? '—',
        assignee: users.find((u) => u.id === t.assigneeId)?.name ?? '—',
      }))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [tasks, deals, users, managerIds, dealStatuses, start, end])

  return (
    <div>
      <Toolbar
        preset={preset}
        onPreset={setPreset}
        managerIds={managerIds}
        onManagers={setManagerIds}
        dealStatuses={dealStatuses}
        onStatuses={setDealStatuses}
        users={users}
      />

      <Typography.Title level={4}>Просроченные задачи</Typography.Title>
      <Typography.Paragraph type='secondary' style={{ marginTop: 0 }}>
        Не завершены, срок в выбранном периоде; этап — по связанной сделке.
      </Typography.Paragraph>
      <Table
        size='small'
        pagination={tablePaging}
        dataSource={overdue}
        onRow={() => ({
          style: { background: 'rgba(254, 226, 226, 0.45)' },
        })}
        columns={[
          {
            title: 'ID задачи',
            dataIndex: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            ellipsis: true,
            width: 120,
          },
          {
            title: 'Название задачи',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
          },
          {
            title: 'Сделка',
            dataIndex: 'dealTitle',
            sorter: (a, b) => a.dealTitle.localeCompare(b.dealTitle),
          },
          {
            title: 'Ответственный',
            dataIndex: 'assignee',
            sorter: (a, b) => a.assignee.localeCompare(b.assignee),
          },
          {
            title: 'Статус',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (s: string) => {
              const m = TASK_STATUS_META[s as keyof typeof TASK_STATUS_META]
              return `${m.label} · просрочена`
            },
          },
          {
            title: 'Дата срока выполнения',
            dataIndex: 'dueDate',
            sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
            render: (v: string) => formatDateRu(v),
          },
        ]}
      />
    </div>
  )
}
