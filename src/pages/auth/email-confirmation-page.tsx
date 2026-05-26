import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Form, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { getMutationErrorMessage } from "../../lib/api/mutation-error-message";
import { emailConfirmFormDefaultValues } from "../../lib/constants/forms";
import { path } from "../../lib/constants/navigation";
import { emailConfirmFormSchema, type EmailConfirmFormValues } from "../../schemas";
import { useConfirmEmailMutation, useResendConfirmationEmailMutation } from "../../store/api";
import { UiInput } from "../../components/ui/input";
import { AuthSplitLayout } from "./auth-split-layout";
import {
  CardSubtitle,
  CardTitle,
  FooterCaption,
  FormCard,
  FormMutedCaption,
  FormStack,
  LeftFooter,
} from "./styled";

type EmailConfirmationLocationState = {
  flow?: "password-recovery";
};

export function EmailConfirmationPage() {
  const location = useLocation();
  const locState = location.state as EmailConfirmationLocationState | null;
  const fromPasswordRecovery = locState?.flow === "password-recovery";

  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation();
  const [resend, { isLoading: isResending }] = useResendConfirmationEmailMutation();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EmailConfirmFormValues>({
    resolver: zodResolver(emailConfirmFormSchema),
    defaultValues: emailConfirmFormDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: EmailConfirmFormValues) => {
    clearErrors("root");
    try {
      await confirmEmail(values).unwrap();
    } catch (err) {
      setError("root", {
        type: "server",
        message: getMutationErrorMessage(err, "Не удалось подтвердить почту"),
      });
    }
  };

  const onResend = async () => {
    try {
      await resend().unwrap();
      message.info("Письмо отправлено повторно (демо).");
    } catch (err) {
      message.error(getMutationErrorMessage(err, "Не удалось отправить письмо"));
    }
  };

  return (
    <AuthSplitLayout
      leftFooter={
        <LeftFooter>
          <FooterCaption>Уже зарегистрированы?</FooterCaption>
          <Link to={path.login}>Войти в аккаунт</Link>
        </LeftFooter>
      }
    >
      <FormCard>
        <CardTitle>Подтверждение почты</CardTitle>
        <CardSubtitle>
          {fromPasswordRecovery
            ? "Вставьте ссылку из письма для восстановления пароля."
            : "Вставьте ссылку из полученного письма"}
        </CardSubtitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Controller
              name="confirmationLink"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Ссылка подтверждения"
                  validateStatus={errors.confirmationLink ? "error" : ""}
                  help={errors.confirmationLink?.message}
                >
                  <UiInput {...field} placeholder="" />
                </Form.Item>
              )}
            />
            {errors.root?.message ? (
              <Alert
                type="error"
                showIcon
                message={errors.root.message}
                style={{ marginBottom: 16 }}
              />
            ) : null}
            <Form.Item>
              <FormStack>
                <Button type="primary" htmlType="submit" block loading={isConfirming} size="large">
                  Подтвердить
                </Button>
                <FormMutedCaption>Не пришло письмо?</FormMutedCaption>
                <Button
                  block
                  size="large"
                  htmlType="button"
                  type="default"
                  variant="outlined"
                  loading={isResending}
                  onClick={onResend}
                >
                  Отправить повторно
                </Button>
              </FormStack>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
