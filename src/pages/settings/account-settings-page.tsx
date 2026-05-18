import { CameraOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Typography,
  message,
} from "antd";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { path } from "../../lib/constants/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearAuth, selectAuthUserId } from "../../store/auth-slice";
import {
  accountSettingsSchema,
  type AccountSettingsFormValues,
} from "../../schemas";
import {
  useDeleteAccountMutation,
  useGetUserByIdQuery,
  useRequestVerifyEmailMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserProfileMutation,
} from "../../store/api";
import { UiInput } from "../../components/ui/input";

function splitName(full: string): { first: string; last: string } {
  const p = full.trim().split(/\s+/);
  if (p.length === 0) return { first: "", last: "" };
  if (p.length === 1) return { first: p[0]!, last: "" };
  return { first: p[0]!, last: p.slice(1).join(" ") };
}

export function AccountSettingsPage(props?: {
  variant?: "settings" | "profile";
}) {
  const variant = props?.variant ?? "settings";
  const pageTitle =
    variant === "profile" ? "Профиль пользователя" : "Настройка аккаунта";
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
  const [savePassword, { isLoading: savingPw }] =
    useUpdateUserPasswordMutation();
  const [requestVerify] = useRequestVerifyEmailMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      existingPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
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

  const showVerify =
    user && emailVal !== undefined && emailVal.trim() !== user.email.trim();

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
      void message.success("Настройки сохранены");
      reset({
        ...values,
        existingPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      void message.error("Не удалось сохранить");
    }
  };

  const onSendVerify = async () => {
    try {
      await requestVerify().unwrap();
      void message.success("Ссылка отправлена (демо)");
    } catch {
      void message.error("Не удалось отправить");
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
          void message.success("Аккаунт удалён");
          navigate(path.login, { replace: true });
        } catch {
          void message.error("Не удалось удалить");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          {pageTitle}
        </Typography.Title>
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
      </>
    );
  }

  const busy = saving || savingPw || deleting;

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {pageTitle}
      </Typography.Title>

      <Card style={{ maxWidth: 920 }}>
        <div style={{ marginBottom: 24, position: "relative", width: 96 }}>
          <Avatar size={96} style={{ backgroundColor: "#3b82f6" }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<CameraOutlined />}
            style={{ position: "absolute", right: -4, bottom: -4 }}
            aria-label="Сменить фото"
            title="Скоро"
            disabled
          />
        </div>

        <Typography.Text
          type="secondary"
          style={{ display: "block", marginBottom: 16 }}
        >
          Добавлен {new Date(user.createdAt).toLocaleDateString("ru-RU")}
        </Typography.Text>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form layout="vertical" requiredMark component="div">
            <Row gutter={16}>
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
                      <UiInput {...field} />
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
                      <UiInput {...field} />
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={16}>
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
                      <UiInput {...field} type="email" />
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
                      <UiInput {...field} />
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>

            {showVerify ? (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
                message="Подтвердите почту, чтобы пользоваться всеми возможностями системы"
                action={
                  <Button size="small" type="primary" onClick={onSendVerify}>
                    Отправить ссылку
                  </Button>
                }
              />
            ) : null}

            <Typography.Title level={5}>Пароль</Typography.Title>
            <Controller
              name="existingPassword"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Существующий пароль"
                  validateStatus={errors.existingPassword ? "error" : ""}
                  help={errors.existingPassword?.message}
                >
                  <Input.Password {...field} autoComplete="current-password" />
                </Form.Item>
              )}
            />
            <Row gutter={16}>
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
                      <Input.Password {...field} autoComplete="new-password" />
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
                      <Input.Password {...field} autoComplete="new-password" />
                    </Form.Item>
                  )}
                />
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={busy}>
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        </form>

        {variant === "settings" ? (
          <Button
            type="link"
            danger
            onClick={onDelete}
            style={{ padding: 0, height: "auto" }}
          >
            Удалить аккаунт
          </Button>
        ) : null}
        <div style={{ marginTop: 16 }}>
          <Link to={path.welcome}>← На главную</Link>
        </div>
      </Card>
    </div>
  );
}
