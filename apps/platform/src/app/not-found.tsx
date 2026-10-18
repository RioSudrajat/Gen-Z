import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-3xl font-semibold">This page is not available</h1>
      <p className="my-6 leading-8 text-muted-foreground">
        The requested platform feature has not been implemented or is not
        available to this session.
      </p>
      <Link href="/auth" className="button">
        Back to Gen-Z sign-in
      </Link>
    </main>
  );
}
