import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CrmModal } from "../../components/crm-modal";
import {
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "../../components/crm-modal/crm-modal.styled";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import { useCreateClientMutation } from "../../store/api";
import { ClientModalEditFields } from "./client-modal-fields";

const defaultValues: ClientFormValues = {
  name: "",
  phone: "",
  email: "",
  company: "",
  website: "",
  comment: "",
};

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
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) reset(defaultValues);
  }, [open, reset]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      await createClient(values).unwrap();
      void message.success("Клиент создан");
      onClose();
    } catch {
      void message.error("Не удалось создать клиента");
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
            onClick={() => void handleSubmit(onSubmit)()}
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
