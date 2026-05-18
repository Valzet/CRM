import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { loginFormSchema, type LoginFormValues } from "../../schemas";
import { useLoginMutation } from "../../store/api";
import { setAuthUser } from "../../store/auth-slice";
import { UiInput } from "../../components/ui/input";
import { AuthSplitLayout } from "./auth-split-layout";
import { CardTitle, ForgotPasswordRow, FormCard, LeftFooter } from "./styled";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setAuthUser(result.userId));
      void message.success("Вход выполнен");
      navigate(path.welcome, { replace: true });
    } catch (err) {
      const e = err as FetchBaseQueryError;
      const detail =
        typeof e.data === "string"
          ? e.data
          : "Не удалось войти. Запущен ли json-server?";
      void message.error(detail);
    }
  };

  return (
    <AuthSplitLayout
      leftFooter={
        <LeftFooter>
          У вас ещё нет аккаунта?{" "}
          <Link to={path.register}>Зарегистрироваться</Link>
        </LeftFooter>
      }
    >
      <FormCard>
        <CardTitle>Вход в аккаунт</CardTitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="email или логин"
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
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Пароль"
                  validateStatus={errors.password ? "error" : ""}
                  help={errors.password?.message}
                >
                  <Input.Password
                    {...field}
                    autoComplete="current-password"
                    placeholder="••••••"
                  />
                </Form.Item>
              )}
            />
            <ForgotPasswordRow>
              <Link to={path.passwordRecovery}>Забыли пароль?</Link>
            </ForgotPasswordRow>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size="large"
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
