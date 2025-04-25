import { auth } from "@/server/auth";
import { db } from "@/server/db";
export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await db.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })

        return user;
    } catch (error) {
        return null
    }
}

export const getUserById = async (id: string | undefined ) => {
    if (!id) return null;
    try {
        const user = await db.user.findUnique({
        where: {
            id
        }
    }); 

    return user;
    } catch (error) {
        return null
    }
}

export const getAccountById = async (id:string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId : id
            }
        })


        return account;
    } catch (error) {
        return null
    }
}

export const getUserFromSession = async() => {
    const session = await auth();
    if (!session?.user?.id) return null;

    
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    return user;
  };