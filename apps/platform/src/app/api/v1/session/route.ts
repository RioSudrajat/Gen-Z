import { NextResponse } from "next/server";
import { api, privateHeaders } from "@/server/http";
import { getSession } from "@/server/auth/session";
import { readEnvironment } from "@/server/config";

export const runtime = "nodejs";
export function GET() {
  return api(async () => {
    const session = await getSession();
    if (!session)
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in with your wallet.",
          },
        },
        { status: 401, headers: privateHeaders },
      );
    return NextResponse.json(
      { ...session, environment: readEnvironment(), workspaces: [] },
      { headers: privateHeaders },
    );
  });
}
