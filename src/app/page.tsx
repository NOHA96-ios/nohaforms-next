import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#008080]">
          JustForms
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center rounded-lg bg-[#008080] px-4 text-sm font-medium text-white transition-colors hover:bg-[#006666]"
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="inline-flex h-9 items-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-lg bg-[#008080] px-4 text-sm font-medium text-white transition-colors hover:bg-[#006666]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Forms that feel effortless
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-neutral-500">
          Build and share beautiful forms. Collect responses without the clutter.
        </p>
      </section>
    </main>
  );
}
