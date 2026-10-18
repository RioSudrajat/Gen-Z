import { redirect } from "next/navigation";
import { requireSession } from "@/server/auth/session";
export default async function Workspace() {
  await requireSession();
  redirect("/app");
}
