import "server-only";
import type { ZodType } from "zod";
import { NextResponse } from "next/server";
import { authConfig } from "./auth/config";
import { AuthError } from "./auth/service";

export const privateHeaders = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};

export function requireOrigin(request: Request) {
  if (request.headers.get("Origin") !== authConfig().origin) {
    throw new AuthError(
      403,
      "INVALID_ORIGIN",
      "This request must come from the Gen-Z app.",
    );
  }
}

export async function readJson<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  if (!request.headers.get("Content-Type")?.startsWith("application/json")) {
    throw new AuthError(
      415,
      "JSON_REQUIRED",
      "Send an application/json request.",
    );
  }
  const reader = request.body?.getReader();
  let text = "";
  if (reader) {
    let size = 0;
    const decoder = new TextDecoder();
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          throw new AuthError(413, "BODY_TOO_LARGE", "Request is too large.");
        }
        text += decoder.decode(part.value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      reader.releaseLock();
    }
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AuthError(400, "INVALID_JSON", "Invalid JSON request.");
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success)
    throw new AuthError(
      422,
      "INVALID_INPUT",
      "Check the wallet proof fields and try again.",
    );
  return parsed.data;
}

export async function api(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status, headers: privateHeaders },
      );
    console.error(
      "Gen-Z API request failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return NextResponse.json(
      {
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Gen-Z is temporarily unavailable. Please try again.",
        },
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
