import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {
  EmailConfirmFormValues,
  LoginFormValues,
  PasswordRecoveryFormValues,
  RegisterFormValues,
} from "../../schemas/auth";
import type { UserRecord } from "../../types/user";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    login: builder.mutation<{ ok: true; userId: string }, LoginFormValues>({
      async queryFn(body) {
        await sleep(150);
        const res = await fetch("/api/users");
        if (!res.ok) {
          const text = await res.text();
          return {
            error: {
              status: res.status,
              data: text || "Сервер недоступен",
            } as FetchBaseQueryError,
          };
        }
        const users = (await res.json()) as UserRecord[];
        const q = body.email.trim().toLowerCase();
        const hit = users.find((u) => {
          const emailMatch = typeof u.email === "string" && u.email.trim().toLowerCase() === q;
          const usernameMatch =
            typeof u.username === "string" && u.username.trim().toLowerCase() === q;
          return u.password === body.password && (emailMatch || usernameMatch);
        });
        if (!hit) {
          return {
            error: {
              status: 401,
              data: "Неверный email или пароль",
            } as FetchBaseQueryError,
          };
        }
        return { data: { ok: true as const, userId: hit.id } };
      },
    }),

    register: builder.mutation<UserRecord, RegisterFormValues>({
      async queryFn(body) {
        await sleep(150);
        const emailNorm = body.email.trim().toLowerCase();
        const dupRes = await fetch("/api/users");
        if (!dupRes.ok) {
          const text = await dupRes.text();
          return {
            error: {
              status: dupRes.status,
              data: text || "Не удалось проверить email",
            } as FetchBaseQueryError,
          };
        }
        const allUsers = (await dupRes.json()) as UserRecord[];
        const clash = allUsers.some(
          (u) => typeof u.email === "string" && u.email.trim().toLowerCase() === emailNorm,
        );
        if (clash) {
          return {
            error: {
              status: 400,
              data: "Пользователь с таким email уже зарегистрирован",
            } as FetchBaseQueryError,
          };
        }
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: body.email.trim(),
            password: body.password,
            name: `${body.firstName} ${body.lastName}`.trim(),
            username: body.username,
            createdAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          return {
            error: {
              status: res.status,
              data: text || "Не удалось зарегистрироваться",
            } as FetchBaseQueryError,
          };
        }
        return { data: (await res.json()) as UserRecord };
      },
    }),

    requestPasswordReset: builder.mutation<{ ok: true }, PasswordRecoveryFormValues>({
      async queryFn(_body) {
        await sleep(500);
        return { data: { ok: true as const } };
      },
    }),

    confirmEmail: builder.mutation<{ ok: true }, EmailConfirmFormValues>({
      async queryFn(_body) {
        await sleep(450);
        return { data: { ok: true as const } };
      },
    }),

    resendConfirmationEmail: builder.mutation<{ ok: true }, void>({
      async queryFn() {
        await sleep(400);
        return { data: { ok: true as const } };
      },
    }),

    updateUserPassword: builder.mutation<UserRecord, { id: string; password: string }>({
      async queryFn({ id, password }) {
        const res = await fetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) {
          const text = await res.text();
          return {
            error: {
              status: res.status,
              data: text || "Не удалось сменить пароль",
            } as FetchBaseQueryError,
          };
        }
        return { data: (await res.json()) as UserRecord };
      },
    }),

    requestVerifyEmail: builder.mutation<{ ok: true }, void>({
      async queryFn() {
        await sleep(350);
        return { data: { ok: true as const } };
      },
    }),

    deleteAccount: builder.mutation<{ ok: true }, { userId: string }>({
      async queryFn({ userId }) {
        const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
        if (!res.ok) {
          const text = await res.text();
          return {
            error: {
              status: res.status,
              data: text || "Не удалось удалить аккаунт",
            } as FetchBaseQueryError,
          };
        }
        return { data: { ok: true as const } };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useConfirmEmailMutation,
  useResendConfirmationEmailMutation,
  useUpdateUserPasswordMutation,
  useRequestVerifyEmailMutation,
  useDeleteAccountMutation,
} = authApi;
