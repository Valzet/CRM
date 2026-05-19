import { Input } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldControl,
  FieldGrid,
  FieldLabel,
  ReadOnlyTextarea,
  ReadOnlyValue,
} from "../crm-modal";
import { UiInput } from "../ui/input";
import { formatPhoneRu } from "../../lib/format/phone-ru";
import type { ClientFormValues } from "../../schemas";

function displayWebsite(url: string): string {
  if (!url.trim()) return "—";
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

type ViewProps = {
  values: ClientFormValues;
};

export function ClientModalViewFields(props: ViewProps) {
  const { values } = props;

  return (
    <FieldGrid $columns={1}>
      <Field>
        <FieldLabel>Имя</FieldLabel>
        <ReadOnlyValue>{values.name || "—"}</ReadOnlyValue>
      </Field>
      <FieldGrid>
        <Field>
          <FieldLabel>Телефон</FieldLabel>
          <ReadOnlyValue>{formatPhoneRu(values.phone)}</ReadOnlyValue>
        </Field>
        <Field>
          <FieldLabel>Компания</FieldLabel>
          <ReadOnlyValue>{values.company || "—"}</ReadOnlyValue>
        </Field>
      </FieldGrid>
      <FieldGrid>
        <Field>
          <FieldLabel>Сайт</FieldLabel>
          <ReadOnlyValue>{displayWebsite(values.website)}</ReadOnlyValue>
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <ReadOnlyValue>{values.email || "—"}</ReadOnlyValue>
        </Field>
      </FieldGrid>
      <Field>
        <FieldLabel>Комментарий</FieldLabel>
        <ReadOnlyTextarea>{values.comment || "—"}</ReadOnlyTextarea>
      </Field>
    </FieldGrid>
  );
}

type EditProps = {
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
};

export function ClientModalEditFields(props: EditProps) {
  const { control, errors } = props;

  return (
    <FieldGrid $columns={1}>
      <Field>
        <FieldLabel>Имя</FieldLabel>
        <FieldControl>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <UiInput {...field} status={errors.name ? "error" : undefined} />
                {errors.name?.message ? (
                  <span className="ant-form-item-explain-error">
                    {errors.name.message}
                  </span>
                ) : null}
              </>
            )}
          />
        </FieldControl>
      </Field>
      <FieldGrid>
        <Field>
          <FieldLabel>Телефон</FieldLabel>
          <FieldControl>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <UiInput {...field} status={errors.phone ? "error" : undefined} />
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Компания</FieldLabel>
          <FieldControl>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <UiInput
                  {...field}
                  status={errors.company ? "error" : undefined}
                />
              )}
            />
          </FieldControl>
        </Field>
      </FieldGrid>
      <FieldGrid>
        <Field>
          <FieldLabel>Сайт</FieldLabel>
          <FieldControl>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <UiInput
                  {...field}
                  status={errors.website ? "error" : undefined}
                />
              )}
            />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <UiInput
                  {...field}
                  type="email"
                  status={errors.email ? "error" : undefined}
                />
              )}
            />
          </FieldControl>
        </Field>
      </FieldGrid>
      <Field>
        <FieldLabel>Комментарий</FieldLabel>
        <FieldControl>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} />}
          />
        </FieldControl>
      </Field>
    </FieldGrid>
  );
}
