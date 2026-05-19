import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CrmModal, PrimaryFooterButton, SecondaryFooterButton } from "../crm-modal";
import { taskFormSchema, type TaskFormValues } from "../../schemas";
import {
  useCreateTaskMutation,
  useGetDealsQuery,
  useGetUsersQuery,
} from "../../store/api";
import { TaskModalEditFields } from "./task-modal-fields";

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  dealId: "",
  assigneeId: "",
  status: "new",
  dueDateLocal: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TaskCreateModal(props: Props) {
  const { open, onClose } = props;
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: deals = [], isLoading: isLoadingDeals } = useGetDealsQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();

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
    if (!open) reset(defaultValues);
  }, [open, reset]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTask(values).unwrap();
      void message.success("Задача создана");
      onClose();
    } catch {
      void message.error("Не удалось создать задачу");
    }
  };

  return (
    <CrmModal
      open={open}
      onClose={onClose}
      title="Новая задача"
      footer={
        <>
          <PrimaryFooterButton
            type="primary"
            loading={isLoading}
            onClick={() => void handleSubmit(onSubmit)()}
          >
            Создать задачу
          </PrimaryFooterButton>
          <SecondaryFooterButton onClick={onClose}>Отменить</SecondaryFooterButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TaskModalEditFields
          control={control}
          errors={errors}
          deals={deals}
          users={users}
          isLoadingDeals={isLoadingDeals}
          isLoadingUsers={isLoadingUsers}
        />
      </form>
    </CrmModal>
  );
}
