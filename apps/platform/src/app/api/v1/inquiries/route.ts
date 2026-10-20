import { NextResponse } from "next/server";
import { readJson } from "@/server/http";
import { AuthError } from "@/server/auth/service";
import { inquiryApi, inquiryPreflight } from "@/server/intake/http";
import { inquiryRequest } from "@/server/intake/validation";
import { receiveInquiry } from "@/server/intake/service";

export const runtime = "nodejs";
export function POST(request: Request) {
  return inquiryApi(request, async () => {
    const key = request.headers.get("Idempotency-Key");
    if (!key || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(key))
      throw new AuthError(422, "INVALID_INPUT", "Send a UUID Idempotency-Key.");
    const payload = await readJson(request, inquiryRequest, {
      maxBytes: 32768,
      message: "Check your inquiry details and privacy acknowledgment.",
    });
    return NextResponse.json(await receiveInquiry(payload, key.toLowerCase()), {
      status: 201,
    });
  });
}
export function OPTIONS(request: Request) {
  return inquiryPreflight(request);
}
