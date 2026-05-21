import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch, useIsMobile } from "../../hooks";
import { loginFormDefaultValues } from "../../lib/constants/forms";
import { path } from "../../lib/constants/navigation";
import { loginFormSchema, type LoginFormValues } from "../../schemas";
import { useLoginMutation } from "../../store/api";
import { setAuthUser } from "../../store/auth-slice";
import { UiInput } from "../../components/ui/input";
import { AuthLandingPage } from "./auth-landing-page";
import { AuthSplitLayout } from "./auth-split-layout";
import { CardTitle, FooterCaption, ForgotPasswordRow, FormCard, LeftFooter } from "./styled";

type LoginLocationState = {
  showForm?: boolean;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const showForm = (location.state as LoginLocationState | null)?.showForm === true;
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setAuthUser(result.userId));
      console.log("Вход выполнен");
      navigate(path.welcome, { replace: true });
    } catch (err) {
      const e = err as FetchBaseQueryError;
      const detail =
        typeof e.data === "string" ? e.data : "Не удалось войти. Запущен ли json-server?";
      console.error(detail);
    }
  };

  if (isMobile && !showForm) {
    return <AuthLandingPage />;
  }

  return (
    <AuthSplitLayout
      leftFooter={
        <LeftFooter>
          <FooterCaption>Нет аккаунта?</FooterCaption>
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
                  label="Email или логин"
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
                  <Input.Password {...field} autoComplete="current-password" placeholder="••••••" />
                </Form.Item>
              )}
            />
            <ForgotPasswordRow>
              <Link to={path.passwordRecovery}>Забыли пароль?</Link>
            </ForgotPasswordRow>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading} size="large">
                Войти
              </Button>
            </Form.Item>
          </Form>
        </form>
      </FormCard>
    </AuthSplitLayout>
  );
}
