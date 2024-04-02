import { CredentialsSignin } from "next-auth";

export class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found";
}

export class InvalidFieldsError extends CredentialsSignin {
  code = "invalid_fields";
}

export class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect_password";
}
