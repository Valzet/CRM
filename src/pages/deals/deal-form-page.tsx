import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Spin, Typography, message } from "antd";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { path } from "../../lib/constants/navigation";
import { dealFormSchema, type DealFormValues } from "../../schemas";
import {
  useCreateDealMutation,
  useGetClientsQuery,
  useGetDealByIdQuery,
  useUpdateDealMutation,
} from "../../store/api";
import { DealFormFields } from "./deal-form-fields";

const defaultValues: DealFormValues = {
  title: "",
  description: "",
  clientId: "",
  amount: 1,
  status: "new",
};

export function DealFormPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(dealId);

  const { data: deal, isLoading: isLoadingDeal } = useGetDealByIdQuery(dealId!, {
    skip: !isEdit,
  });

  const { data: clientsAll, isLoading: isLoadingClients } = useGetClientsQuery({
    includeDeleted: true,
  });

  const clientsForFields = useMemo(() => {
    const active = clientsAll?.filter((c) => !c.deleted) ?? [];
    if (!deal) return active;
    if (active.some((c) => c.id === deal.clientId)) return active;
    const cur = clientsAll?.find((c) => c.id === deal.clientId);
    return cur ? [...active, cur] : active;
  }, [clientsAll, deal]);

  const [createDeal, { isLoading: isCreating }] = useCreateDealMutation();
  const [updateDeal, { isLoading: isUpdating }] = useUpdateDealMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        description: deal.description,
        clientId: deal.clientId,
        amount: deal.amount,
        status: deal.status,
      });
    }
  }, [deal, reset]);

  const onSubmit = async (values: DealFormValues) => {
    const validClient =
      clientsForFields.some((c) => c.id === values.clientId && !c.deleted) ||
      deal?.clientId === values.clientId;
    if (!validClient) {
      void message.warning("Нельзя сохранить сделку: выберите активного клиента.");
      return;
    }
    if (isEdit && dealId) {
      await updateDeal({ id: dealId, data: values }).unwrap();
    } else {
      await createDeal(values).unwrap();
    }
    navigate(path.deals);
  };

  if (isEdit && isLoadingDeal) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  const busy = isCreating || isUpdating || isLoadingClients;
  const title = isEdit ? "Редактирование сделки" : "Новая сделка";

  const clientLabel = deal && clientsAll?.find((c) => c.id === deal.clientId)?.name;

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Link to={path.deals}>← К списку</Link>
      {clientLabel ? (
        <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
          Клиент: {clientLabel}
        </Typography.Paragraph>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ marginTop: 24 }}>
        <Form layout="vertical" requiredMark component="div">
          <DealFormFields
            control={control}
            errors={errors}
            clients={clientsForFields}
            isLoadingClients={isLoadingClients}
          />

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
