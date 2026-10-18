"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function SignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  async function signOut() {
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      router.replace("/auth");
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="space-y-3">
      <Button className="button-secondary" onClick={signOut} disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </Button>
      {failed && (
        <p role="alert" className="text-destructive">
          Couldn’t sign out. Please try again.
        </p>
      )}
    </div>
  );
}
