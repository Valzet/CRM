import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { CrmModal, PrimaryFooterButton, SecondaryFooterButton } from "../crm-modal";
import { dealFormDefaultValues } from "../../lib/constants/forms";
import { dealFormSchema, type DealFormValues } from "../../schemas";
import { useCreateDealMutation, useGetClientsQuery } from "../../store/api";
import { DealModalEditFields } from "./deal-modal-fields";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DealCreateModal(props: Props) {
  const { open, onClose } = props;
  const [createDeal, { isLoading }] = useCreateDealMutation();
  const { data: clientsAll, isLoading: isLoadingClients } = useGetClientsQuery({
    includeDeleted: false,
  });
  const clientsForSelect = useMemo(() => clientsAll?.filter((c) => !c.deleted) ?? [], [clientsAll]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: dealFormDefaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) reset(dealFormDefaultValues);
  }, [open, reset]);

  const onSubmit = async (values: DealFormValues) => {
    const validClient = clientsForSelect.some((c) => c.id === values.clientId);
    if (!validClient) {
      void message.warning("Выберите активного клиента.");
      return;
    }
    try {
      await createDeal(values).unwrap();
      void message.success("Сделка создана");
      onClose();
    } catch {
      void message.error("Не удалось создать сделку");
    }
  };

  return (
    <CrmModal
      open={open}
      onClose={onClose}
      title="Новая сделка"
      footer={
        <>
          <PrimaryFooterButton
            type="primary"
            loading={isLoading}
            onClick={() => void handleSubmit(onSubmit)()}
          >
            Создать сделку
          </PrimaryFooterButton>
          <SecondaryFooterButton onClick={onClose}>Отменить</SecondaryFooterButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DealModalEditFields
          control={control}
          errors={errors}
          clients={clientsForSelect}
          isLoadingClients={isLoadingClients}
        />
      </form>
    </CrmModal>
  );
}
