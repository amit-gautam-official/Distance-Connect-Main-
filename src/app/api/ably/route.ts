import { auth } from "@/server/auth";
import Ably from "ably";
export const revalidate = 0;

export async function GET(request: Request) {
  
    const session = await auth();
    
    if (session?.user) {
        const client = new Ably.Rest(process.env.ABLY_API_KEY!);
        const tokenRequestData = await client.auth.createTokenRequest({
            clientId: session.user.id,
        });
        return Response.json(tokenRequestData);
    }

  return Response.json({ error: "User not logged in" }, { status: 500 });
}