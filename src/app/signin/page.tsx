import Link from "next/link";
import { signIn } from "@/app/auth/actions";

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 block text-center text-xl font-semibold tracking-tight text-[#008080]">
          JustForms
        </Link>
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to continue to your dashboard.
          </p>
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={signIn} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#008080] focus:ring-1 focus:ring-[#008080]"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700">
              Password
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#008080] focus:ring-1 focus:ring-[#008080]"
                placeholder="Your password"
              />
            </label>
            <button
              type="submit"
              className="mt-2 h-10 rounded-lg bg-[#008080] text-sm font-medium text-white transition-colors hover:bg-[#006666]"
            >
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#008080] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
