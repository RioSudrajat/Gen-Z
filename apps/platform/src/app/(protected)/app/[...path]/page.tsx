import { notFound } from "next/navigation";
import { requireSession } from "@/server/auth/session";
export default async function UnimplementedWorkspace() {
  await requireSession();
  notFound();
}
