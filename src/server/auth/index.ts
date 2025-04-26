import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getAccountById, getUserById } from "@/data/user";
import { db } from "../db";
import { User } from "next-auth";

import { type SessionUser } from "@/types/sessionUser";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),

    session : { strategy: "jwt"},
  
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider !== "credentials") {
             return true;
        }
  
        const existingUser = await getUserById(user.id ?? "");
         
        if(!existingUser?.emailVerified) {
             return false;
        }
  
        return true
   },
   
    
      async session({ token, session }) {
  
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            isOAuth: token.isOauth,
            role: token.role,
            isRegistered: token.isRegistered,
          } as SessionUser,
        };
      },
      async jwt({ token }) {
        // console.log("token in jwt", token);
        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);
  
        if (!existingUser) return token;
        const existingAccount = await getAccountById(existingUser?.id);
  
        token.isOauth = !!existingAccount;
  
        token.role = existingUser.role;
        token.name = existingUser.name;
        token.image = existingUser.image;
        token.email = existingUser.email;
        token.isRegistered = existingUser.isRegistered;
  
        return token;
      },
    }
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
