import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
  iat: number;
  exp: number;
  tokenType: string;
  userId: number;
};

export async function POST(request: Request) {
  const body = await request.json();
  // coi console log cho ben login form no log ra api/auth
  const sessionToken = body.sessionToken as string;
  const expiresAt = body.expiresAt as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      { status: 400 },
    );
  }

  // const payload = decodeJWT<PayloadJWT>(sessionToken);
  const expireDate = new Date(expiresAt).toUTCString();
  return Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expireDate}; SameSite=Lax; Secure`,
    },
  });
}
