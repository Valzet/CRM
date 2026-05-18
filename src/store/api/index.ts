export {
  authApi,
  useConfirmEmailMutation,
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResendConfirmationEmailMutation,
  useUpdateUserPasswordMutation,
  useRequestVerifyEmailMutation,
  useDeleteAccountMutation,
} from "./authApi";

export {
  crmApi,
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
} from "./crmApi";

export type {
  Client,
  Deal,
  DealStatus,
  Task,
  TaskStatus,
  User,
  UserRecord,
} from "../../types";
