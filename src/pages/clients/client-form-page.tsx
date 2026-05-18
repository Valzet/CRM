import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Spin, Typography } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { path } from "../../lib/constants/navigation";
import { clientFormSchema, type ClientFormValues } from "../../schemas";
import {
  useCreateClientMutation,
  useGetClientByIdQuery,
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

export function ClientFormPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(clientId);
  const { data: client, isLoading: isLoadingClient } = useGetClientByIdQuery(
    clientId!,
    { skip: !isEdit },
  );
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
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
    if (client) {
      reset({
        name: client.name,
        phone: client.phone,
        email: client.email,
        company: client.company,
        website: client.website,
        comment: client.comment,
      });
    }
  }, [client, reset]);

  const onSubmit = async (values: ClientFormValues) => {
    if (isEdit && clientId) {
      await updateClient({ id: clientId, data: values }).unwrap();
    } else {
      await createClient(values).unwrap();
    }
    navigate(path.clients);
  };

  if (isEdit && isLoadingClient) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  const title = isEdit ? "Редактирование клиента" : "Новый клиент";
  const busy = isCreating || isUpdating;

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Link to={path.clients}>← К списку</Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ marginTop: 24 }}
      >
        <Form layout="vertical" requiredMark component="div">
          <ClientFormFields control={control} errors={errors} />
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
