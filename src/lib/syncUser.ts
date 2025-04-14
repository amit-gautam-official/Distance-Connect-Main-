import "server-only"
import { db } from "@/server/db";
import { auth0 } from "@/lib/auth0";

export const syncUserToDb = async () => {
  const session = await auth0?.getSession();
  const user = session?.user;

  if (!user || !user.email) return false;

  try {
    await db.user.upsert({
      where: { kindeId: user.sub },
      update: {
        name: user.given_name + " " + user.family_name,
        avatarUrl: user.picture,
        email: user.email,
      },
      create: {
        kindeId: user.sub,
        email: user.email,
        name: user.given_name + " " + user.family_name,
        avatarUrl: user.picture,
        username: user.sub,
      },
    });

    return true;
  } catch (err) {
    console.error("DB sync failed:", err);
    return false;
  }
};
