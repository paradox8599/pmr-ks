export enum Roles {
  None = 0,
  Admin = 1 << 0,
  User = 1 << 1,
  All = ~(~0 << 2),
}

export type RoleStr = keyof typeof Roles;

export type User = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
  createdAt?: Date;
};

export type UserAuthenticationWithPasswordSuccess = {
  item: User;
  sessionToken: string;
};

export type UserAuthenticationWithPasswordFailure = {
  message: string;
};

export type UserAuthenticationWithPasswordResult =
  | UserAuthenticationWithPasswordSuccess
  | UserAuthenticationWithPasswordFailure;
