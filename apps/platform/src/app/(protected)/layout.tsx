import { requireSession } from "@/server/auth/session";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return children;
}
