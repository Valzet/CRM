import type { Client } from "../../types/client";
import type { DealStatus } from "../../types/deal";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Form, Input, InputNumber, Select } from "antd";
import type { DealFormValues } from "../../schemas";
import { UiInput } from "../../components/ui/input";

const statusOptions: { value: DealStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "completed", label: "Завершена" },
  { value: "cancelled", label: "Отменена" },
];

type Props = {
  control: Control<DealFormValues>;
  errors: FieldErrors<DealFormValues>;
  clients: Client[] | undefined;
  isLoadingClients: boolean;
};

export function DealFormFields(props: Props) {
  const { control, errors, clients, isLoadingClients } = props;

  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Название"
            required
            validateStatus={errors.title ? "error" : ""}
            help={errors.title?.message}
          >
            <UiInput {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Описание"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description?.message}
          >
            <Input.TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Controller
        name="clientId"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Клиент"
            required
            validateStatus={errors.clientId ? "error" : ""}
            help={errors.clientId?.message}
          >
            <Select
              {...field}
              placeholder="Выберите клиента"
              options={clients?.map((c) => ({
                value: c.id,
                label: `${c.name}${c.deleted ? " (удалён)" : ""}`,
              }))}
              loading={isLoadingClients}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Сумма, ₽"
            required
            validateStatus={errors.amount ? "error" : ""}
            help={errors.amount?.message}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              value={field.value}
              onChange={(v) => field.onChange(v ?? 1)}
            />
          </Form.Item>
        )}
      />
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Статус"
            required
            validateStatus={errors.status ? "error" : ""}
            help={errors.status?.message}
          >
            <Select {...field} options={statusOptions} />
          </Form.Item>
        )}
      />
    </>
  );
}
