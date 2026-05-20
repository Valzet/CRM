import { CameraOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Avatar, Button, Col, Form, Input, Modal, Row, Spin } from "antd";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BackLink } from "../../components/ui";
import { accountSettingsFormDefaultValues } from "../../lib/constants/forms";
import { path } from "../../lib/constants/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearAuth, selectAuthUserId } from "../../store/auth-slice";
import { accountSettingsSchema, type AccountSettingsFormValues } from "../../schemas";
import {
  useDeleteAccountMutation,
  useGetUserByIdQuery,
  useRequestVerifyEmailMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserProfileMutation,
} from "../../store/api";
import { UiInput } from "../../components/ui/input";
import {
  AvatarBlock,
  AvatarCameraBtn,
  BackLinkRow,
  DeleteAccountLink,
  FormFooter,
  PageHeading,
  SectionHeading,
  SettingsInner,
  SettingsPageRoot,
  SettingsSurface,
  StyledForm,
} from "./settings.styled";
import { color } from "../../theme";

function splitName(full: string): { first: string; last: string } {
  const p = full.trim().split(/\s+/);
  if (p.length === 0) return { first: "", last: "" };
  if (p.length === 1) return { first: p[0]!, last: "" };
  return { first: p[0]!, last: p.slice(1).join(" ") };
}

export function AccountSettingsPage(props?: { variant?: "settings" | "profile" }) {
  const variant = props?.variant ?? "settings";
  const pageTitle = variant === "profile" ? "Профиль пользователя" : "Настройка аккаунта";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const [saveProfile, { isLoading: saving }] = useUpdateUserProfileMutation();
  const [savePassword, { isLoading: savingPw }] = useUpdateUserPasswordMutation();
  const [requestVerify] = useRequestVerifyEmailMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: accountSettingsFormDefaultValues,
    mode: "onTouched",
  });

  const emailVal = useWatch({ control, name: "email" });

  useEffect(() => {
    if (user) {
      const { first, last } = splitName(user.name);
      reset({
        firstName: first,
        lastName: last,
        email: user.email,
        username: user.username ?? "",
        existingPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const showVerify = user && emailVal !== undefined && emailVal.trim() !== user.email.trim();

  const onSubmit = async (values: AccountSettingsFormValues) => {
    if (!user) return;
    try {
      await saveProfile({
        id: user.id,
        data: {
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          username: values.username,
        },
      }).unwrap();

      if (values.newPassword) {
        await savePassword({
          id: user.id,
          password: values.newPassword,
        }).unwrap();
      }
      console.log("Настройки сохранены");
      reset({
        ...values,
        existingPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      console.error("Не удалось сохранить");
    }
  };

  const onSendVerify = async () => {
    try {
      await requestVerify().unwrap();
      console.log("Ссылка отправлена (демо)");
    } catch {
      console.error("Не удалось отправить");
    }
  };

  const onDelete = () => {
    Modal.confirm({
      title: "Удалить аккаунт?",
      content: "Действие необратимо для демо-данных json-server.",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          if (!user) return;
          await deleteAccount({ userId: user.id }).unwrap();
          dispatch(clearAuth());
          console.log("Аккаунт удалён");
          navigate(path.login, { replace: true });
        } catch {
          console.error("Не удалось удалить");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <SettingsPageRoot>
        <SettingsInner $centered={variant === "profile"}>
          <div style={{ padding: 48, textAlign: "center" }}>
            <Spin />
          </div>
        </SettingsInner>
      </SettingsPageRoot>
    );
  }

  if (isError || !user) {
    return (
      <SettingsPageRoot>
        <SettingsInner $centered={variant === "profile"}>
          <PageHeading>{pageTitle}</PageHeading>
          <Alert
            type="error"
            showIcon
            message="Не удалось загрузить данные"
            description={
              error && "status" in error
                ? "Запустите json-server: npm run server"
                : "Проверьте сеть."
            }
            action={
              <Button size="small" onClick={() => refetch()}>
                Повторить
              </Button>
            }
          />
        </SettingsInner>
      </SettingsPageRoot>
    );
  }

  const busy = saving || savingPw || deleting;

  return (
    <SettingsPageRoot>
      <SettingsInner $centered={variant === "profile"}>
        <PageHeading>{pageTitle}</PageHeading>

        <SettingsSurface>
          <AvatarBlock>
            <Avatar
              size={120}
              style={{
                backgroundColor: "#ec4899",
                fontSize: 42,
                fontWeight: 600,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            {/* отличные набор иконок от яндекса. Пришлось иконку антд использовать */}
            <AvatarCameraBtn
              type="primary"
              style={{ background: color.accent.primary, width: "40px", height: "40px" }}
              shape="circle"
              size="small"
              icon={<CameraOutlined style={{ color: "white" }} />}
              aria-label="Сменить фото"
              title="Скоро"
              disabled
            />
          </AvatarBlock>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledForm layout="vertical" requiredMark component="div">
              <Row gutter={[20, 0]}>
                <Col xs={24} md={12}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Имя"
                        required
                        validateStatus={errors.firstName ? "error" : ""}
                        help={errors.firstName?.message}
                      >
                        <UiInput {...field} size="large" />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Фамилия"
                        required
                        validateStatus={errors.lastName ? "error" : ""}
                        help={errors.lastName?.message}
                      >
                        <UiInput {...field} size="large" />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[20, 0]}>
                <Col xs={24} md={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Email"
                        required
                        validateStatus={errors.email ? "error" : ""}
                        help={errors.email?.message}
                      >
                        <UiInput {...field} type="email" size="large" />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Имя аккаунта"
                        required
                        validateStatus={errors.username ? "error" : ""}
                        help={errors.username?.message}
                      >
                        <UiInput {...field} size="large" />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>

              {showVerify ? (
                <Alert
                  type="warning"
                  showIcon
                  style={{ marginBottom: 20 }}
                  message="Подтвердите почту, чтобы пользоваться всеми возможностями системы"
                  action={
                    <Button size="small" type="primary" onClick={onSendVerify}>
                      Отправить ссылку
                    </Button>
                  }
                />
              ) : null}

              <SectionHeading>Пароль</SectionHeading>

              <Row gutter={[20, 0]}>
                <Col xs={12}>
                  <Controller
                    name="existingPassword"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Существующий пароль"
                        validateStatus={errors.existingPassword ? "error" : ""}
                        help={errors.existingPassword?.message}
                      >
                        <Input.Password {...field} size="large" autoComplete="current-password" />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={[20, 0]}>
                <Col xs={24} md={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Новый пароль"
                        validateStatus={errors.newPassword ? "error" : ""}
                        help={errors.newPassword?.message}
                      >
                        <Input.Password {...field} size="large" autoComplete="new-password" />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Form.Item
                        label="Повторите пароль"
                        validateStatus={errors.confirmPassword ? "error" : ""}
                        help={errors.confirmPassword?.message}
                      >
                        <Input.Password {...field} size="large" autoComplete="new-password" />
                      </Form.Item>
                    )}
                  />
                </Col>
              </Row>

              <FormFooter>
                {variant === "settings" ? (
                  <DeleteAccountLink type="link" onClick={onDelete}>
                    Удалить аккаунт
                  </DeleteAccountLink>
                ) : (
                  <span />
                )}
                <Button type="primary" htmlType="submit" size="large" loading={busy}>
                  Сохранить
                </Button>
              </FormFooter>
            </StyledForm>
          </form>

          {variant === "profile" ? (
            <BackLinkRow>
              <BackLink to={path.welcome}>На главную</BackLink>
            </BackLinkRow>
          ) : null}
        </SettingsSurface>
      </SettingsInner>
    </SettingsPageRoot>
  );
}
