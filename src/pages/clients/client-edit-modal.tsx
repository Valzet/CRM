import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, Typography, message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import { path } from "../../lib/constants/navigation";
import {
  useGetClientByIdQuery,
  useSoftDeleteClientMutation,
  useUpdateClientMutation,
} from "../../store/api";
import { ClientFormFields } from "./client-form-fields";

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

export function ClientEditModal(props: Props) {
  const { clientId, open, onClose } = props;
  const { data: client, isFetching } = useGetClientByIdQuery(clientId!, {
    skip: !open || !clientId,
  });
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [softDelete, { isLoading: deleting }] = useSoftDeleteClientMutation();

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
    if (!open) return;
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

  const onSave = async (values: ClientFormValues) => {
    if (!clientId) return;
    try {
      await updateClient({ id: clientId, data: values }).unwrap();
      void message.success("Клиент сохранён");
      onClose();
    } catch {
      void message.error("Не удалось сохранить");
    }
  };

  const onRemove = async () => {
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
          void message.success("Клиент помечен как удалённый");
          onClose();
        } catch {
          void message.error("Не удалось удалить");
          throw new Error("cancel");
        }
      },
    });
  };

  const isDeletedOpen = Boolean(client?.deleted);

  return (
    <Modal
      title="Редактирование клиента"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      confirmLoading={isFetching}
    >
      {isDeletedOpen ? (
        <Typography.Text type="danger">
          Этот клиент удалён.{" "}
          <Link to={`${path.clients}/${clientId}/edit`}>
            Открыть полную форму
          </Link>
        </Typography.Text>
      ) : (
        <>
          <Link
            to={`${path.clients}/${clientId}/edit`}
            style={{ marginBottom: 16, display: "inline-block" }}
          >
            Открыть на отдельной странице
          </Link>
          <form onSubmit={handleSubmit(onSave)} noValidate>
            <Form layout="vertical" requiredMark component="div">
              <ClientFormFields control={control} errors={errors} />
              <Form.Item style={{ marginBottom: 8 }}>
                <Button type="primary" htmlType="submit" loading={updating}>
                  Сохранить
                </Button>
                <Button
                  danger
                  type="default"
                  style={{ marginLeft: 8 }}
                  onClick={() => void onRemove()}
                  disabled={!clientId}
                >
                  Удалить (мягкое)
                </Button>
              </Form.Item>
            </Form>
          </form>
        </>
      )}
    </Modal>
  );
}
