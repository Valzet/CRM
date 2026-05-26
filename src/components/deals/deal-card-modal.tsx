import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CrmModal,
  ModalBodyLoading,
  PrimaryFooterButton,
  SecondaryFooterButton,
  SuccessFooterButton,
} from "../crm-modal";
import { getMutationErrorMessage } from "../../lib/api/mutation-error-message";
import { dealFormDefaultValues } from "../../lib/constants/forms";
import { formatDateRu } from "../../lib/format/date-ru";
import { dealFormSchema, type DealFormValues } from "../../schemas";
import { useGetClientsQuery, useGetDealByIdQuery, useUpdateDealMutation } from "../../store/api";
import { DealModalEditFields, DealModalViewFields } from "./deal-modal-fields";

type Props = {
  dealId: string | null;
  open: boolean;
  onClose: () => void;
};

export function DealCardModal(props: Props) {
  const { dealId, open, onClose } = props;
  const [mode, setMode] = useState<"view" | "edit">("view");
  if (!open && mode !== "view") {
    setMode("view");
  }
  const { data: deal, isFetching } = useGetDealByIdQuery(dealId!, {
    skip: !open || !dealId,
  });
  const { data: clientsAll, isLoading: isLoadingClients } = useGetClientsQuery({
    includeDeleted: true,
  });
  const [updateDeal, { isLoading: updating }] = useUpdateDealMutation();

  const clientsForSelect = useMemo(() => {
    const active = clientsAll?.filter((c) => !c.deleted) ?? [];
    if (!deal) return active;
    if (active.some((c) => c.id === deal.clientId)) return active;
    const cur = clientsAll?.find((c) => c.id === deal.clientId);
    return cur ? [...active, cur] : active;
  }, [clientsAll, deal]);

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
    if (!open || !deal) return;
    reset({
      title: deal.title,
      description: deal.description,
      clientId: deal.clientId,
      amount: deal.amount,
      status: deal.status,
    });
  }, [deal, open, reset]);

  const values = useWatch({ control }) as DealFormValues;
  const clientName = clientsAll?.find((c) => c.id === values?.clientId)?.name ?? "—";

  const handleClose = () => {
    setMode("view");
    onClose();
  };

  const onSave = async (formValues: DealFormValues) => {
    if (!dealId) return;
    const validClient =
      clientsForSelect.some((c) => c.id === formValues.clientId) &&
      (clientsForSelect.some((c) => !c.deleted && c.id === formValues.clientId) ||
        deal?.clientId === formValues.clientId);
    if (!validClient) {
      message.warning("Нельзя привязать сделку к удалённому клиенту. Выберите активного клиента.");
      return;
    }
    try {
      await updateDeal({ id: dealId, data: formValues }).unwrap();

      setMode("view");
    } catch (err) {
      message.error(getMutationErrorMessage(err, "Не удалось сохранить сделку"));
    }
  };

  const onComplete = async () => {
    if (!dealId || !deal) return;
    try {
      await updateDeal({
        id: dealId,
        data: {
          title: deal.title,
          description: deal.description,
          clientId: deal.clientId,
          amount: deal.amount,
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      }).unwrap();

      handleClose();
    } catch (err) {
      message.error(getMutationErrorMessage(err, "Не удалось завершить сделку"));
    }
  };

  const meta = deal?.createdAt ? `Создана ${formatDateRu(deal.createdAt)}` : undefined;

  const canComplete =
    deal && deal.status !== "completed" && deal.status !== "cancelled" && mode === "view";

  const footer =
    mode === "view" ? (
      <>
        <PrimaryFooterButton type="primary" onClick={() => setMode("edit")}>
          Редактировать
        </PrimaryFooterButton>
        {canComplete ? (
          <SuccessFooterButton onClick={() => onComplete()}>Завершить сделку</SuccessFooterButton>
        ) : (
          <SecondaryFooterButton onClick={handleClose}>Закрыть</SecondaryFooterButton>
        )}
      </>
    ) : (
      <>
        <PrimaryFooterButton
          type="primary"
          loading={updating}
          onClick={() => handleSubmit(onSave)()}
        >
          Сохранить
        </PrimaryFooterButton>
        <SecondaryFooterButton onClick={() => setMode("view")}>Отменить</SecondaryFooterButton>
      </>
    );

  return (
    <CrmModal
      open={open}
      onClose={handleClose}
      title="Карточка сделки"
      meta={meta}
      loading={isFetching}
      footer={footer}
    >
      {isFetching && !deal ? (
        <ModalBodyLoading />
      ) : mode === "view" ? (
        <DealModalViewFields values={values} clientName={clientName} />
      ) : (
        <form onSubmit={handleSubmit(onSave)} noValidate>
          <DealModalEditFields
            control={control}
            errors={errors}
            clients={clientsForSelect}
            isLoadingClients={isLoadingClients}
          />
        </form>
      )}
    </CrmModal>
  );
}
