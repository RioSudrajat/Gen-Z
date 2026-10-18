import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api, privateHeaders, requireOrigin } from "@/server/http";
import { challengeCookie, sessionCookie } from "@/server/auth/config";
import { revokeSession } from "@/server/auth/service";

export const runtime = "nodejs";
export function POST(request: Request) {
  return api(async () => {
    requireOrigin(request);
    const jar = await cookies();
    await revokeSession(
      jar.get(sessionCookie)?.value,
      jar.get(challengeCookie)?.value,
    );
    const response = new NextResponse(null, {
      status: 204,
      headers: privateHeaders,
    });
    response.cookies.delete(sessionCookie);
    response.cookies.delete(challengeCookie);
    return response;
  });
}
