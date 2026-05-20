import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CrmModal, ModalBodyLoading } from "../crm-modal";
import { DangerFooterButton, PrimaryFooterButton, SecondaryFooterButton } from "../crm-modal";
import { clientFormDefaultValues } from "../../lib/constants/forms";
import { formatDateRu } from "../../lib/format/date-ru";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import {
  useGetClientByIdQuery,
  useSoftDeleteClientMutation,
  useUpdateClientMutation,
} from "../../store/api";
import { ClientModalEditFields, ClientModalViewFields } from "./client-modal-fields";

type Props = {
  clientId: string | null;
  open: boolean;
  onClose: () => void;
};

export function ClientCardModal(props: Props) {
  const { clientId, open, onClose } = props;
  const [mode, setMode] = useState<"view" | "edit">("view");
  if (!open && mode !== "view") {
    setMode("view");
  }
  const { data: client, isFetching } = useGetClientByIdQuery(clientId!, {
    skip: !open || !clientId,
  });
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [softDelete] = useSoftDeleteClientMutation();

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
    if (!open || !client || client.deleted) return;
    reset({
        name: client.name,
        phone: client.phone,
        email: client.email,
        company: client.company,
        website: client.website,
        comment: client.comment,
      });
  }, [client, open, reset]);

  const handleClose = () => {
    setMode("view");
    onClose();
  };

  const values = useWatch({ control }) as ClientFormValues;

  const onSave = async (formValues: ClientFormValues) => {
    if (!clientId) return;
    try {
      await updateClient({ id: clientId, data: formValues }).unwrap();
      console.log("Клиент сохранён");
      setMode("view");
    } catch {
      console.error("Не удалось сохранить");
    }
  };

  const onRemove = () => {
    if (!clientId) return;

    try {
      softDelete(clientId).unwrap();
      console.log("Клиент удалён");
      handleClose();
    } catch {
      console.error("Не удалось удалить");
      throw new Error("cancel");
    }
  };

  const meta = client?.createdAt ? `добавлен ${formatDateRu(client.createdAt)}` : undefined;

  const footer =
    mode === "view" ? (
      <>
        <PrimaryFooterButton
          type="primary"
          onClick={() => setMode("edit")}
          disabled={!client || client.deleted}
        >
          Редактировать
        </PrimaryFooterButton>
        <DangerFooterButton onClick={onRemove} disabled={!clientId}>
          Удалить клиента
        </DangerFooterButton>
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
      title="Карточка клиента"
      meta={meta}
      loading={isFetching}
      footer={footer}
    >
      {isFetching && !client ? (
        <ModalBodyLoading />
      ) : client?.deleted ? (
        <p style={{ margin: 0, color: "#EF4444" }}>Клиент удалён</p>
      ) : mode === "view" ? (
        <ClientModalViewFields values={values} />
      ) : (
        <form onSubmit={handleSubmit(onSave)} noValidate>
          <ClientModalEditFields control={control} errors={errors} />
        </form>
      )}
    </CrmModal>
  );
}
