import { User } from "next-auth";


export type SessionUser = User & {
  isRegistered: boolean;
  role: string;
  isOAuth : boolean;
};