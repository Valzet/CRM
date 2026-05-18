import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, message, Space } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { path } from "../../lib/constants/navigation";
import {
  emailConfirmFormSchema,
  type EmailConfirmFormValues,
} from "../../schemas";
import {
  useConfirmEmailMutation,
  useResendConfirmationEmailMutation,
} from "../../store/api";
import { UiInput } from "../../components/ui/input";
import { AuthSplitLayout } from "./auth-split-layout";
import { CardSubtitle, CardTitle, FormCard, LeftFooter } from "./styled";

export function EmailConfirmationPage() {
  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation();
  const [resend, { isLoading: isResending }] =
    useResendConfirmationEmailMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailConfirmFormValues>({
    resolver: zodResolver(emailConfirmFormSchema),
    defaultValues: { confirmationLink: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: EmailConfirmFormValues) => {
    try {
      await confirmEmail(values).unwrap();
      void message.success("Почта подтверждена (демо).");
    } catch {
      void message.error("Не удалось подтвердить");
    }
  };

  const onResend = async () => {
    try {
      await resend().unwrap();
      void message.info("Письмо отправлено повторно (демо).");
    } catch {
      void message.error("Не удалось отправить");
    }
  };

  return (
    <AuthSplitLayout
      leftFooter={
        <LeftFooter>
          Уже зарегистрированы? <Link to={path.login}>Войти в аккаунт</Link>
        </LeftFooter>
      }
    >
      <FormCard>
        <CardTitle>Подтверждение почты</CardTitle>
        <CardSubtitle>Вставьте ссылку из полученного письма</CardSubtitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Controller
              name="confirmationLink"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Ссылка подтверждения"
                  required
                  validateStatus={errors.confirmationLink ? "error" : ""}
                  help={errors.confirmationLink?.message}
                >
                  <UiInput {...field} placeholder="https://…" />
                </Form.Item>
              )}
            />
            <Form.Item>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isConfirming}
                  size="large"
                >
                  Подтвердить
                </Button>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "var(--crm-color-text-secondary)",
                  }}
                >
                  Не пришло письмо?
                </div>
                <Button
                  block
                  size="large"
                  htmlType="button"
                  type="default"
                  loading={isResending}
                  onClick={onResend}
                >
                  Отправить повторно
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
