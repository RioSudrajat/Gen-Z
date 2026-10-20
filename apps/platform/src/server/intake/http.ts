import "server-only";
import { NextResponse } from "next/server";
import { authConfig } from "../auth/config";
import { AuthError } from "../auth/service";
import { api } from "../http";

function local(origin: string) {
  try {
    const url = new URL(origin);
    return (
      url.origin === origin &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
export function inquiryOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  const app = authConfig().origin;
  const configured = process.env.GENZ_MARKETING_ORIGIN?.trim();
  const allowed =
    origin &&
    (origin === app || origin === configured || (local(app) && local(origin)));
  if (!allowed)
    throw new AuthError(
      403,
      "INVALID_ORIGIN",
      "Use the Gen-Z contact page to send an inquiry.",
    );
  return origin;
}
export async function inquiryApi(
  request: Request,
  handler: () => Promise<Response>,
) {
  let origin: string | undefined;
  const response = await api(async () => {
    origin = inquiryOrigin(request);
    return handler();
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Origin");
  if (origin) response.headers.set("Access-Control-Allow-Origin", origin);
  return response;
}
export function inquiryPreflight(request: Request) {
  return inquiryApi(request, async () => {
    if (request.headers.get("Access-Control-Request-Method") !== "POST")
      throw new AuthError(403, "INVALID_ORIGIN", "Unsupported inquiry method.");
    const headers =
      request.headers
        .get("Access-Control-Request-Headers")
        ?.toLowerCase()
        .split(",")
        .map((value) => value.trim()) ?? [];
    if (
      headers.some(
        (value) => !["content-type", "idempotency-key"].includes(value),
      )
    )
      throw new AuthError(
        403,
        "INVALID_ORIGIN",
        "Unsupported inquiry headers.",
      );
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
        "Access-Control-Max-Age": "600",
      },
    });
  });
}
