import Link from "next/link";
import { signUp } from "@/app/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 block text-center text-xl font-semibold tracking-tight text-[#008080]">
          JustForms
        </Link>
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Start building forms in minutes.
          </p>
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={signUp} className="mt-6 flex flex-col gap-4">
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
                minLength={6}
                autoComplete="new-password"
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-normal text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#008080] focus:ring-1 focus:ring-[#008080]"
                placeholder="At least 6 characters"
              />
            </label>
            <button
              type="submit"
              className="mt-2 h-10 rounded-lg bg-[#008080] text-sm font-medium text-white transition-colors hover:bg-[#006666]"
            >
              Sign up
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-[#008080] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
