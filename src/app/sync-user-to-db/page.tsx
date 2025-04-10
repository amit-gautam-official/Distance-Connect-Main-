import "server-only";
import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";


const SyncUser = async () => {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("User not found");
  }
  if (!user.email) {
    return notFound();
  }

  try {

    await db.user.upsert({
      where: {
        kindeId: user.sub,
      },
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
        username : user.sub,
      },
    });


    //console.log("User Synced", user)
  } catch (error) {
    //console.log(error);
    return notFound();
  }

  return redirect("/register");
};

export default SyncUser;
