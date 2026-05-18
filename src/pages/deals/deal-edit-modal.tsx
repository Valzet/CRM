import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Modal, message } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { dealFormSchema, type DealFormValues } from "../../schemas";
import { path } from "../../lib/constants/navigation";
import {
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

type Props = {
  dealId: string | null;
  open: boolean;
  onClose: () => void;
};

export function DealEditModal(props: Props) {
  const { dealId, open, onClose } = props;
  const { data: deal, isFetching } = useGetDealByIdQuery(dealId!, {
    skip: !open || !dealId,
  });
  const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery({
    includeDeleted: true,
  });
  const activeClientsList = clients?.filter((c) => !c.deleted) ?? [];
  const clientsForSelect = (() => {
    if (!deal) return activeClientsList;
    if (activeClientsList.some((c) => c.id === deal.clientId)) {
      return activeClientsList;
    }
    const cur = clients?.find((c) => c.id === deal.clientId);
    return cur ? [...activeClientsList, cur] : activeClientsList;
  })();

  const [updateDeal, { isLoading: updating }] = useUpdateDealMutation();

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
    if (!open) return;
    if (deal) {
      reset({
        title: deal.title,
        description: deal.description,
        clientId: deal.clientId,
        amount: deal.amount,
        status: deal.status,
      });
    }
  }, [deal, open, reset]);

  const onSave = async (values: DealFormValues) => {
    if (!dealId) return;
    const validClient =
      clientsForSelect.some((c) => c.id === values.clientId) &&
      (clientsForSelect.some((c) => !c.deleted && c.id === values.clientId) ||
        deal?.clientId === values.clientId);
    if (!validClient) {
      void message.warning(
        "Нельзя привязать сделку к удалённому клиенту как к новому. Выберите активного клиента.",
      );
      return;
    }
    try {
      await updateDeal({ id: dealId, data: values }).unwrap();
      void message.success("Сделка сохранена");
      onClose();
    } catch {
      void message.error("Не удалось сохранить");
    }
  };

  return (
    <Modal
      title="Редактирование сделки"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      confirmLoading={isFetching}
    >
      <Link
        to={`${path.deals}/${dealId}/edit`}
        style={{ marginBottom: 16, display: "inline-block" }}
      >
        Открыть на отдельной странице
      </Link>

      <form onSubmit={handleSubmit(onSave)} noValidate>
        <Form layout="vertical" requiredMark component="div">
          <DealFormFields
            control={control}
            errors={errors}
            clients={clientsForSelect}
            isLoadingClients={isLoadingClients}
          />
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={updating}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </form>
    </Modal>
  );
}
