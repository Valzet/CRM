import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Select, Spin, Typography } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isoToDatetimeLocalValue } from "../../lib/date/datetime-local";
import { path } from "../../lib/constants/navigation";
import { taskFormSchema, type TaskFormValues } from "../../schemas";
import type { TaskStatus } from "../../types";
import {
  useCreateTaskMutation,
  useGetDealsQuery,
  useGetTaskByIdQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
} from "../../store/api";
import { UiInput } from "../../components/ui/input";

const workflowStatuses: { value: TaskStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
];

const statusOptionsFor = (current?: TaskStatus) => {
  if (current === "completed")
    return [{ value: "completed", label: "Завершена" }, ...workflowStatuses];
  return workflowStatuses;
};

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  dealId: "",
  assigneeId: "",
  status: "new",
  dueDateLocal: "",
};

export function TaskFormPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(taskId);

  const { data: task, isLoading: isLoadingTask } = useGetTaskByIdQuery(
    taskId!,
    {
      skip: !isEdit,
    },
  );

  const { data: deals, isLoading: isLoadingDeals } = useGetDealsQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        dealId: task.dealId,
        assigneeId: task.assigneeId,
        status: task.status,
        dueDateLocal: isoToDatetimeLocalValue(task.dueDate),
      });
    }
  }, [task, reset]);

  const onSubmit = async (values: TaskFormValues) => {
    if (isEdit && taskId) {
      await updateTask({ id: taskId, data: values }).unwrap();
    } else {
      await createTask(values).unwrap();
    }
    navigate(path.tasks);
  };

  if (isEdit && isLoadingTask) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  const busy = isCreating || isUpdating || isLoadingDeals || isLoadingUsers;
  const title = isEdit ? "Редактирование задачи" : "Новая задача";
  const dealTitle = task && deals?.find((d) => d.id === task.dealId)?.title;

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Link to={path.tasks}>← К списку</Link>
      {dealTitle ? (
        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
          Сделка: {dealTitle}
        </Typography.Paragraph>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ marginTop: 24 }}
      >
        <Form layout="vertical" requiredMark component="div">
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
            name="dealId"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Сделка"
                required
                validateStatus={errors.dealId ? "error" : ""}
                help={errors.dealId?.message}
              >
                <Select
                  {...field}
                  placeholder="Выберите сделку"
                  options={deals?.map((d) => ({
                    value: d.id,
                    label: d.title,
                  }))}
                  loading={isLoadingDeals}
                />
              </Form.Item>
            )}
          />
          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Исполнитель"
                required
                validateStatus={errors.assigneeId ? "error" : ""}
                help={errors.assigneeId?.message}
              >
                <Select
                  {...field}
                  placeholder="Выберите исполнителя"
                  options={users?.map((u) => ({
                    value: u.id,
                    label: u.name,
                  }))}
                  loading={isLoadingUsers}
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
                <Select {...field} options={statusOptionsFor(task?.status)} />
              </Form.Item>
            )}
          />
          <Controller
            name="dueDateLocal"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Срок выполнения"
                required
                validateStatus={errors.dueDateLocal ? "error" : ""}
                help={errors.dueDateLocal?.message}
              >
                <Input {...field} type="datetime-local" />
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={busy}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </form>
    </div>
  );
}
