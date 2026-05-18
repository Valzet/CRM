export { clientFormSchema, type ClientFormValues } from "./client";
export { dealFormSchema, type DealFormValues } from "./deal";
export { taskFormSchema, type TaskFormValues } from "./task";
export {
  accountSettingsSchema,
  type AccountProfilePatch,
  type AccountSettingsFormValues,
} from "./account-settings";
export { profileFormSchema, type ProfileFormValues } from "./profile";
export {
  emailConfirmFormSchema,
  loginFormSchema,
  passwordRecoveryFormSchema,
  registerFormSchema,
  type EmailConfirmFormValues,
  type LoginFormValues,
  type PasswordRecoveryFormValues,
  type RegisterFormValues,
} from "./auth";
export { collapseWhitespaceTrim } from "./normalize";
