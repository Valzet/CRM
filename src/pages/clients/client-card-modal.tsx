import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CrmModal } from "../../components/crm-modal";
import {
  DangerFooterButton,
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "../../components/crm-modal/crm-modal.styled";
import { formatDateRu } from "../../lib/format/date-ru";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import {
  useGetClientByIdQuery,
  useSoftDeleteClientMutation,
  useUpdateClientMutation,
} from "../../store/api";
import {
  ClientModalEditFields,
  ClientModalViewFields,
} from "./client-modal-fields";

const defaultValues: ClientFormValues = {
  name: "",
  phone: "",
  email: "",
  company: "",
  website: "",
  comment: "",
};

type Props = {
  clientId: string | null;
  open: boolean;
  onClose: () => void;
};

export function ClientCardModal(props: Props) {
  const { clientId, open, onClose } = props;
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { data: client, isFetching } = useGetClientByIdQuery(clientId!, {
    skip: !open || !clientId,
  });
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [softDelete, { isLoading: deleting }] = useSoftDeleteClientMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      setMode("view");
      return;
    }
    if (client && !client.deleted) {
      reset({
        name: client.name,
        phone: client.phone,
        email: client.email,
        company: client.company,
        website: client.website,
        comment: client.comment,
      });
    }
  }, [client, open, reset]);

  const values = watch();

  const onSave = async (formValues: ClientFormValues) => {
    if (!clientId) return;
    try {
      await updateClient({ id: clientId, data: formValues }).unwrap();
      void message.success("Клиент сохранён");
      setMode("view");
    } catch {
      void message.error("Не удалось сохранить");
    }
  };

  const onRemove = () => {
    if (!clientId) return;
    Modal.confirm({
      title: "Удалить клиента?",
      content:
        "Клиент будет помечен как удалённый. Новые сделки с ним создать нельзя.",
      okText: "Удалить",
      okButtonProps: { danger: true, loading: deleting },
      cancelText: "Отмена",
      async onOk() {
        try {
          await softDelete(clientId).unwrap();
          void message.success("Клиент удалён");
          onClose();
        } catch {
          void message.error("Не удалось удалить");
          throw new Error("cancel");
        }
      },
    });
  };

  const meta = client?.createdAt
    ? `добавлен ${formatDateRu(client.createdAt)}`
    : undefined;

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
          onClick={() => void handleSubmit(onSave)()}
        >
          Сохранить
        </PrimaryFooterButton>
        <SecondaryFooterButton onClick={() => setMode("view")}>
          Отменить
        </SecondaryFooterButton>
      </>
    );

  return (
    <CrmModal
      open={open}
      onClose={onClose}
      title="Карточка клиента"
      meta={meta}
      loading={isFetching}
      footer={footer}
    >
      {isFetching && !client ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
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
