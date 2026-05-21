import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { passwordRecoveryFormDefaultValues } from "../../lib/constants/forms";
import { path } from "../../lib/constants/navigation";
import { passwordRecoveryFormSchema, type PasswordRecoveryFormValues } from "../../schemas";
import { useRequestPasswordResetMutation } from "../../store/api";
import { UiInput } from "../../components/ui/input";
import { AuthSplitLayout } from "./auth-split-layout";
import { CardSubtitle, CardTitle, FooterCaption, FormCard, LeftFooter } from "./styled";

export function PasswordRecoveryPage() {
  const navigate = useNavigate();
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryFormValues>({
    resolver: zodResolver(passwordRecoveryFormSchema),
    defaultValues: passwordRecoveryFormDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: PasswordRecoveryFormValues) => {
    try {
      await requestReset(values).unwrap();
      navigate(path.emailConfirmation, {
        replace: true,
        state: { flow: "password-recovery" as const },
      });
    } catch {
      console.error("Запрос не выполнен");
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
        <CardTitle>Восстановление пароля</CardTitle>
        <CardSubtitle>
          Укажите почту, на которую вы регистрировали аккаунт, и мы отправим вам инструкцию по
          восстановлению пароля.
        </CardSubtitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email?.message}
                >
                  <UiInput
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="ivanov@yandex.ru"
                  />
                </Form.Item>
              )}
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading} size="large">
                Восстановить
              </Button>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
