import { NextResponse } from "next/server";
import { inquiryApi } from "@/server/intake/http";
import { inquiryPolicy } from "@/server/intake/policy";

export const runtime = "nodejs";
export function GET(request: Request) {
  return inquiryApi(request, async () => NextResponse.json(inquiryPolicy()));
}
