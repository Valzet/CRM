import type {
  EmailConfirmFormValues,
  LoginFormValues,
  PasswordRecoveryFormValues,
  RegisterFormValues,
} from "../../../schemas";

export const registerFormDefaultValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export const loginFormDefaultValues: LoginFormValues = {
  email: "",
  password: "",
};

export const passwordRecoveryFormDefaultValues: PasswordRecoveryFormValues = {
  email: "",
};

export const emailConfirmFormDefaultValues: EmailConfirmFormValues = {
  confirmationLink: "",
};
