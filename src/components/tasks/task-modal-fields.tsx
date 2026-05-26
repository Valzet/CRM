import { Input, Select } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldControl, FieldGrid, FieldLabel } from "../crm-modal";
import { UiInput } from "../ui/input";
import type { TaskFormValues } from "../../schemas";
import type { Deal } from "../../types/deal";
import type { TaskStatus } from "../../types/task";
import type { User } from "../../types/user";

const workflowStatuses: { value: TaskStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
];

function statusOptionsFor(current?: TaskStatus) {
  if (current === "completed") {
    return [{ value: "completed" as const, label: "Завершена" }, ...workflowStatuses];
  }
  return workflowStatuses;
}

type EditProps = {
  control: Control<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  deals: Deal[];
  users: User[];
  isLoadingDeals: boolean;
  isLoadingUsers: boolean;
  currentStatus?: TaskStatus;
};

export function TaskModalEditFields(props: EditProps) {
  const { control, errors, deals, users, isLoadingDeals, isLoadingUsers, currentStatus } = props;

  return (
    <FieldGrid $columns={1}>
      <Field>
        <FieldLabel>Название</FieldLabel>
        <FieldControl>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <>
                <UiInput {...field} status={errors.title ? "error" : undefined} />
                {errors.title?.message ? (
                  <span className="ant-form-item-explain-error">{errors.title.message}</span>
                ) : null}
              </>
            )}
          />
        </FieldControl>
      </Field>
      <FieldGrid>
        <Field>
          <FieldLabel>Сделка</FieldLabel>
          <FieldControl>
            <Controller
              name="dealId"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Выберите сделку"
                    options={deals.map((d) => ({ value: d.id, label: d.title }))}
                    loading={isLoadingDeals}
                    showSearch
                    optionFilterProp="label"
                    status={errors.dealId ? "error" : undefined}
                  />
                  {errors.dealId?.message ? (
                    <span className="ant-form-item-explain-error">{errors.dealId.message}</span>
                  ) : null}
                </>
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Исполнитель</FieldLabel>
          <FieldControl>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    placeholder="Выберите исполнителя"
                    options={users.map((u) => ({ value: u.id, label: u.name }))}
                    loading={isLoadingUsers}
                    showSearch
                    optionFilterProp="label"
                    status={errors.assigneeId ? "error" : undefined}
                  />
                  {errors.assigneeId?.message ? (
                    <span className="ant-form-item-explain-error">{errors.assigneeId.message}</span>
                  ) : null}
                </>
              )}
            />
          </FieldControl>
        </Field>
      </FieldGrid>
      <FieldGrid>
        <Field>
          <FieldLabel>Статус</FieldLabel>
          <FieldControl>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    options={statusOptionsFor(currentStatus)}
                    status={errors.status ? "error" : undefined}
                  />
                  {errors.status?.message ? (
                    <span className="ant-form-item-explain-error">{errors.status.message}</span>
                  ) : null}
                </>
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Срок выполнения</FieldLabel>
          <FieldControl>
            <Controller
              name="dueDateLocal"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    type="datetime-local"
                    status={errors.dueDateLocal ? "error" : undefined}
                  />
                  {errors.dueDateLocal?.message ? (
                    <span className="ant-form-item-explain-error">
                      {errors.dueDateLocal.message}
                    </span>
                  ) : null}
                </>
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
