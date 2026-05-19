import { Input, InputNumber, Select } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldControl,
  FieldGrid,
  FieldLabel,
  ReadOnlyTextarea,
  ReadOnlyValue,
  StatusReadOnly,
} from "../crm-modal";
import { UiInput } from "../ui/input";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatMoneyRu } from "../../lib/format/money-ru";
import type { DealFormValues } from "../../schemas";
import type { Client } from "../../types/client";
import type { DealStatus } from "../../types/deal";

const statusOptions: { value: DealStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "completed", label: "Завершена" },
  { value: "cancelled", label: "Отменена" },
];

type ViewProps = {
  values: DealFormValues;
  clientName: string;
};

export function DealModalViewFields(props: ViewProps) {
  const { values, clientName } = props;
  const statusLabel = DEAL_STATUS_META[values.status].label;

  return (
    <FieldGrid $columns={1}>
      <FieldGrid>
        <Field>
          <FieldLabel>Название</FieldLabel>
          <ReadOnlyValue>{values.title || "—"}</ReadOnlyValue>
        </Field>
        <Field>
          <FieldLabel>Клиент</FieldLabel>
          <ReadOnlyValue>{clientName || "—"}</ReadOnlyValue>
        </Field>
      </FieldGrid>
      <FieldGrid>
        <Field>
          <FieldLabel>Сумма</FieldLabel>
          <ReadOnlyValue>{formatMoneyRu(values.amount)}</ReadOnlyValue>
        </Field>
        <Field>
          <FieldLabel>Статус</FieldLabel>
          <StatusReadOnly $tone={values.status === "in_progress" ? "primary" : "default"}>
            {statusLabel}
          </StatusReadOnly>
        </Field>
      </FieldGrid>
      <Field>
        <FieldLabel>Описание</FieldLabel>
        <ReadOnlyTextarea>{values.description || "—"}</ReadOnlyTextarea>
      </Field>
    </FieldGrid>
  );
}

type EditProps = {
  control: Control<DealFormValues>;
  errors: FieldErrors<DealFormValues>;
  clients: Client[];
  isLoadingClients: boolean;
};

export function DealModalEditFields(props: EditProps) {
  const { control, errors, clients, isLoadingClients } = props;

  return (
    <FieldGrid $columns={1}>
      <FieldGrid>
        <Field>
          <FieldLabel>Название</FieldLabel>
          <FieldControl>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <UiInput {...field} status={errors.title ? "error" : undefined} />
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Клиент</FieldLabel>
          <FieldControl>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Выберите клиента"
                  options={clients.map((c) => ({
                    value: c.id,
                    label: `${c.name}${c.deleted ? " (удалён)" : ""}`,
                  }))}
                  loading={isLoadingClients}
                  showSearch
                  optionFilterProp="label"
                  status={errors.clientId ? "error" : undefined}
                />
              )}
            />
          </FieldControl>
        </Field>
      </FieldGrid>
      <FieldGrid>
        <Field>
          <FieldLabel>Сумма</FieldLabel>
          <FieldControl>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <InputNumber
                  min={1}
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? 1)}
                  status={errors.amount ? "error" : undefined}
                  formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "")}
                  parser={(v) => Number(v?.replace(/\s/g, "") ?? 0)}
                />
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Статус</FieldLabel>
          <FieldControl>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statusOptions}
                  status={errors.status ? "error" : undefined}
                />
              )}
            />
          </FieldControl>
        </Field>
      </FieldGrid>
      <Field>
        <FieldLabel>Описание</FieldLabel>
        <FieldControl>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} />}
          />
        </FieldControl>
      </Field>
    </FieldGrid>
  );
}
