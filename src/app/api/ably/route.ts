import Ably from "ably";
import { auth0 } from "@/lib/auth0";
export const revalidate = 0;

export async function GET(request: Request) {
  
    const session = await auth0.getSession();
    
    if (session?.user) {
        const client = new Ably.Rest(process.env.ABLY_API_KEY!);
        const tokenRequestData = await client.auth.createTokenRequest({
            clientId: session.user.sub,
        });
        return Response.json(tokenRequestData);
    }

  return Response.json({ error: "User not logged in" }, { status: 500 });
}