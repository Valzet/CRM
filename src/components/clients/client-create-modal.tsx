import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CrmModal, PrimaryFooterButton, SecondaryFooterButton } from "../crm-modal";
import { clientFormDefaultValues } from "../../lib/constants/forms";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import { useCreateClientMutation } from "../../store/api";
import { ClientModalEditFields } from "./client-modal-fields";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ClientCreateModal(props: Props) {
  const { open, onClose } = props;
  const [createClient, { isLoading }] = useCreateClientMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: clientFormDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) reset(clientFormDefaultValues);
  }, [open, reset]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      await createClient(values).unwrap();
      onClose();
    } catch {
      message.error("Не удалось создать клиента");
    }
  };

  return (
    <CrmModal
      open={open}
      onClose={onClose}
      title="Новый клиент"
      footer={
        <>
          <PrimaryFooterButton
            type="primary"
            loading={isLoading}
            onClick={() => handleSubmit(onSubmit)()}
          >
            Создать
          </PrimaryFooterButton>
          <SecondaryFooterButton onClick={onClose}>Отменить</SecondaryFooterButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ClientModalEditFields control={control} errors={errors} />
      </form>
    </CrmModal>
  );
}
