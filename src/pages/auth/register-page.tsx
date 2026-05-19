import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { registerFormDefaultValues } from "../../lib/constants/forms";
import { path } from "../../lib/constants/navigation";
import { registerFormSchema, type RegisterFormValues } from "../../schemas";
import { useRegisterMutation } from "../../store/api";
import { UiInput } from "../../components/ui/input";
import { AuthSplitLayout } from "./auth-split-layout";
import { CardTitle, FormCard, LeftFooter } from "./styled";

export function RegisterPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values).unwrap();
      console.log("Регистрация прошла успешно. Войдите в аккаунт.");
      navigate(path.login, { replace: true });
    } catch (err) {
      const e = err as FetchBaseQueryError;
      const detail =
        typeof e.data === "string"
          ? e.data
          : "Не удалось зарегистрироваться. Запущен ли json-server?";
      console.error(detail);
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
        <CardTitle>Регистрация</CardTitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Имя"
                  validateStatus={errors.firstName ? "error" : ""}
                  help={errors.firstName?.message}
                >
                  <UiInput {...field} autoComplete="given-name" placeholder="Ярополк" />
                </Form.Item>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Фамилия"
                  validateStatus={errors.lastName ? "error" : ""}
                  help={errors.lastName?.message}
                >
                  <UiInput {...field} autoComplete="family-name" placeholder="Иванов" />
                </Form.Item>
              )}
            />
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
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Имя аккаунта"
                  validateStatus={errors.username ? "error" : ""}
                  help={errors.username?.message}
                >
                  <UiInput {...field} autoComplete="username" placeholder="Yaropolk" />
                </Form.Item>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Придумайте пароль"
                  validateStatus={errors.password ? "error" : ""}
                  help={errors.password?.message}
                >
                  <Input.Password {...field} autoComplete="new-password" placeholder="••••••" />
                </Form.Item>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Повторите пароль"
                  validateStatus={errors.confirmPassword ? "error" : ""}
                  help={errors.confirmPassword?.message}
                >
                  <Input.Password {...field} autoComplete="new-password" placeholder="••••••" />
                </Form.Item>
              )}
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading} size="large">
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
