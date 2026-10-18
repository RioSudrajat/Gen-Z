import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api, privateHeaders, readJson, requireOrigin } from "@/server/http";
import {
  authConfig,
  challengeCookie,
  sessionCookie,
} from "@/server/auth/config";
import { verifyWalletProof } from "@/server/auth/service";
import { proofRequest } from "@/server/auth/validation";

export const runtime = "nodejs";
export function POST(request: Request) {
  return api(async () => {
    requireOrigin(request);
    const proof = await readJson(request, proofRequest);
    const jar = await cookies();
    const session = await verifyWalletProof(
      proof,
      jar.get(challengeCookie)?.value,
      jar.get(sessionCookie)?.value,
    );
    const config = authConfig();
    const response = NextResponse.json(
      { address: session.address, expiresAt: session.expiresAt },
      { headers: privateHeaders },
    );
    response.cookies.set(sessionCookie, session.token, {
      httpOnly: true,
      secure: config.secure,
      sameSite: "lax",
      path: "/",
      maxAge: session.sessionSeconds,
    });
    return response;
  });
}
