import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CrmModal,
  ModalBodyLoading,
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "../crm-modal";
import { taskFormDefaultValues } from "../../lib/constants/forms";
import { isoToDatetimeLocalValue } from "../../lib/date/datetime-local";
import { formatDateRu } from "../../lib/format/date-ru";
import { taskFormSchema, type TaskFormValues } from "../../schemas";
import {
  useGetDealsQuery,
  useGetTaskByIdQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
} from "../../store/api";
import { TaskModalEditFields } from "./task-modal-fields";

type Props = {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
};

export function TaskEditModal(props: Props) {
  const { taskId, open, onClose } = props;
  const { data: task, isFetching } = useGetTaskByIdQuery(taskId!, {
    skip: !open || !taskId,
  });
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const { data: deals = [], isLoading: isLoadingDeals } = useGetDealsQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: taskFormDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      reset(taskFormDefaultValues);
      return;
    }
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
  }, [task, open, reset]);

  const onSubmit = async (values: TaskFormValues) => {
    if (!taskId) return;
    try {
      await updateTask({ id: taskId, data: values }).unwrap();
      console.log("Задача сохранена");
      onClose();
    } catch {
      console.error("Не удалось сохранить задачу");
    }
  };

  const meta = task?.createdAt ? `Создана ${formatDateRu(task.createdAt)}` : undefined;

  return (
    <CrmModal
      open={open}
      onClose={onClose}
      title="Редактирование задачи"
      meta={meta}
      loading={isFetching}
      footer={
        <>
          <PrimaryFooterButton
            type="primary"
            loading={isLoading}
            onClick={() => handleSubmit(onSubmit)()}
          >
            Сохранить
          </PrimaryFooterButton>
          <SecondaryFooterButton onClick={onClose}>Отменить</SecondaryFooterButton>
        </>
      }
    >
      {isFetching && !task ? (
        <ModalBodyLoading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TaskModalEditFields
            control={control}
            errors={errors}
            deals={deals}
            users={users}
            isLoadingDeals={isLoadingDeals}
            isLoadingUsers={isLoadingUsers}
            currentStatus={task?.status}
          />
        </form>
      )}
    </CrmModal>
  );
}
