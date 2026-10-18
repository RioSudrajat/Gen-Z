import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie } from "./config";
import { readSession } from "./service";

export const getSession = cache(async () =>
  readSession((await cookies()).get(sessionCookie)?.value),
);

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/auth");
  return session;
}
