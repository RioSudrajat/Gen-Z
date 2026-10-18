"use client";
import { Button } from "@/components/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-3xl font-semibold">
        Gen-Z is temporarily unavailable
      </h1>
      <p className="my-6 leading-8 text-muted-foreground">
        This page could not load. Please try again in a moment.
      </p>
      <Button onClick={reset}>Reload page</Button>
    </main>
  );
}
