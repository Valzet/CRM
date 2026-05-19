import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { AuthState } from "../auth-slice";
import { selectAuthUserId } from "../auth-slice";
import type { ClientFormValues } from "../../schemas/client";
import type { DealFormValues } from "../../schemas/deal";
import type { AccountProfilePatch } from "../../schemas/account-settings";
import type { TaskFormValues } from "../../schemas/task";
import type { Client } from "../../types/client";
import type { Deal } from "../../types/deal";
import type { Task } from "../../types/task";
import type { User, UserRecord } from "../../types/user";

function stripUserPassword(row: UserRecord): User {
  const { password, ...rest } = row;
  void password;
  return rest;
}

function unauthorized(): { error: FetchBaseQueryError } {
  return {
    error: { status: 401, data: "Требуется вход" } as FetchBaseQueryError,
  };
}

function readAuth(getState: () => unknown): string | null {
  return selectAuthUserId(getState() as { auth: AuthState });
}

const listTagFactory =
  <T extends { id: string }>(kind: "Client" | "Deal" | "Task" | "User") =>
  (result: T[] | undefined) =>
    result
      ? [
          ...result.map(({ id }) => ({ type: kind, id }) as const),
          { type: kind, id: "LIST" } as const,
        ]
      : [{ type: kind, id: "LIST" } as const];

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Client", "Deal", "Task", "User"],
  endpoints: (builder) => ({
    getClients: builder.query<Client[], { includeDeleted?: boolean } | void>({
      query: () => ({ url: "/clients" }),
      transformResponse: (rows: Client[], _meta, arg) => {
        const includeDeleted =
          typeof arg === "object" && arg !== null && Boolean(arg.includeDeleted);
        return includeDeleted ? rows : rows.filter((c) => !c.deleted);
      },
      providesTags: listTagFactory<Client>("Client"),
    }),

    getClientById: builder.query<Client, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, _err, id) =>
        result ? [{ type: "Client" as const, id: result.id }] : [{ type: "Client" as const, id }],
    }),

    createClient: builder.mutation<Client, ClientFormValues>({
      queryFn: async (body, api, _extraOptions, baseQuery) => {
        const userId = readAuth(api.getState);
        if (!userId) return unauthorized();
        const res = await baseQuery({
          url: "/clients",
          method: "POST",
          body: {
            ...body,
            deleted: false,
            createdAt: new Date().toISOString(),
            createdBy: userId,
          },
        });
        if (res.error) return { error: res.error as FetchBaseQueryError };
        return { data: res.data as Client };
      },
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),

    updateClient: builder.mutation<Client, { id: string; data: ClientFormValues }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),

    softDeleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: { deleted: true },
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),

    getDeals: builder.query<Deal[], { clientId?: string } | void>({
      query: (arg) => ({
        url: "/deals",
        params:
          arg && typeof arg === "object" && arg.clientId ? { clientId: arg.clientId } : undefined,
      }),
      providesTags: listTagFactory<Deal>("Deal"),
    }),

    getDealById: builder.query<Deal, string>({
      query: (id) => `/deals/${id}`,
      providesTags: (result, _err, id) =>
        result ? [{ type: "Deal" as const, id: result.id }] : [{ type: "Deal" as const, id }],
    }),

    createDeal: builder.mutation<Deal, DealFormValues>({
      queryFn: async (body, api, _extraOptions, baseQuery) => {
        const userId = readAuth(api.getState);
        if (!userId) return unauthorized();
        const res = await baseQuery({
          url: "/deals",
          method: "POST",
          body: {
            ...body,
            createdAt: new Date().toISOString(),
            createdBy: userId,
          },
        });
        if (res.error) return { error: res.error as FetchBaseQueryError };
        return { data: res.data as Deal };
      },
      invalidatesTags: [{ type: "Deal", id: "LIST" }],
    }),

    updateDeal: builder.mutation<
      Deal,
      {
        id: string;
        data: DealFormValues & Partial<Pick<Deal, "completedAt">>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/deals/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Deal", id },
        { type: "Deal", id: "LIST" },
      ],
    }),

    getTasks: builder.query<Task[], { dealId?: string } | void>({
      query: (arg) => ({
        url: "/tasks",
        params: arg && typeof arg === "object" && arg.dealId ? { dealId: arg.dealId } : undefined,
      }),
      providesTags: listTagFactory<Task>("Task"),
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, _err, id) =>
        result ? [{ type: "Task" as const, id: result.id }] : [{ type: "Task" as const, id }],
    }),

    createTask: builder.mutation<Task, TaskFormValues>({
      queryFn: async (values, api, _extraOptions, baseQuery) => {
        const userId = readAuth(api.getState);
        if (!userId) return unauthorized();
        const { dueDateLocal, ...rest } = values;
        const res = await baseQuery({
          url: "/tasks",
          method: "POST",
          body: {
            ...rest,
            dueDate: new Date(dueDateLocal).toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: userId,
          },
        });
        if (res.error) return { error: res.error as FetchBaseQueryError };
        return { data: res.data as Task };
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Task, { id: string; data: TaskFormValues }>({
      query: ({ id, data }) => {
        const { dueDateLocal, ...rest } = data;
        return {
          url: `/tasks/${id}`,
          method: "PATCH",
          body: {
            ...rest,
            dueDate: new Date(dueDateLocal).toISOString(),
          },
        };
      },
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (rows: UserRecord[]) => rows.map(stripUserPassword),
      providesTags: listTagFactory<User>("User"),
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (row: UserRecord) => stripUserPassword(row),
      providesTags: (result, _err, id) =>
        result ? [{ type: "User" as const, id: result.id }] : [{ type: "User" as const, id }],
    }),

    updateUserProfile: builder.mutation<User, { id: string; data: AccountProfilePatch }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useSoftDeleteClientMutation,
  useGetDealsQuery,
  useGetDealByIdQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
} = crmApi;
