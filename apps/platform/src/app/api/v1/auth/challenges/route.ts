import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api, privateHeaders, readJson, requireOrigin } from "@/server/http";
import { authConfig, challengeCookie } from "@/server/auth/config";
import { createChallenge } from "@/server/auth/service";
import { challengeRequest } from "@/server/auth/validation";

export const runtime = "nodejs";
export function POST(request: Request) {
  return api(async () => {
    requireOrigin(request);
    const { address } = await readJson(request, challengeRequest);
    const challenge = await createChallenge(
      address,
      (await cookies()).get(challengeCookie)?.value,
    );
    const response = NextResponse.json(
      {
        challengeId: challenge.id,
        message: challenge.message,
        chainId: challenge.chainId,
      },
      { headers: privateHeaders },
    );
    response.cookies.set(challengeCookie, challenge.binding, {
      httpOnly: true,
      secure: authConfig().secure,
      sameSite: "strict",
      path: "/",
      maxAge: 600,
    });
    return response;
  });
}
