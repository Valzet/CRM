import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Form, Input } from "antd";
import type { ClientFormValues } from "../../schemas";
import { UiInput } from "../../components/ui/input";

type Props = {
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
};

export function ClientFormFields(props: Props) {
  const { control, errors } = props;

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Имя / название"
            required
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <UiInput {...field} autoComplete="name" />
          </Form.Item>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Телефон"
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone?.message}
          >
            <UiInput {...field} autoComplete="tel" />
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
            <UiInput {...field} type="email" autoComplete="email" />
          </Form.Item>
        )}
      />
      <Controller
        name="company"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Компания"
            validateStatus={errors.company ? "error" : ""}
            help={errors.company?.message}
          >
            <UiInput {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Сайт"
            validateStatus={errors.website ? "error" : ""}
            help={errors.website?.message}
          >
            <UiInput {...field} type="url" placeholder="https://" />
          </Form.Item>
        )}
      />
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Комментарий"
            validateStatus={errors.comment ? "error" : ""}
            help={errors.comment?.message}
          >
            <Input.TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
    </>
  );
}
