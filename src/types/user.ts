export type UserRecord = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  username?: string;
};

export type User = Omit<UserRecord, "password">;
