import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createForm, deleteForm } from './actions';
import TitleEditor from './title-editor';
import { Plus, FileText, Trash2, Pencil, ArrowUpRight } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: forms } = await supabase
    .from('forms')
    .select('id, title, slug, published, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const formIds = (forms || []).map((f) => f.id);
  const { data: submissions } = formIds.length
    ? await supabase
        .from('submissions')
        .select('form_id')
        .in('form_id', formIds)
    : { data: [] };

  const counts: Record<string, number> = {};
  (submissions || []).forEach((s: { form_id: string }) => {
    counts[s.form_id] = (counts[s.form_id] || 0) + 1;
  });

  const email = user.email || '';
  const initial = email.charAt(0).toUpperCase();
  const formCount = forms?.length || 0;
  const isAtLimit = formCount >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* DEMO BANNER */}
      <div className="bg-teal-700 text-white text-center text-sm py-2.5 px-4">
        <span className="font-medium">This is a demo of JustForms.</span>{' '}
        Want to run your own version?{' '}
        <a
          href="https://justforms.gumroad.com/l/app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-teal-100"
        >
          Get the code for $49 →
        </a>
      </div>

      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-teal-700 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-neutral-900 tracking-tight">
              JustForms
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100">
              <div className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-semibold flex items-center justify-center">
                {initial}
              </div>
              <span className="text-xs text-neutral-600 max-w-[160px] truncate">
                {email}
              </span>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-md px-3 py-1.5 transition-colors hover:bg-neutral-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
              Your forms
            </h1>
            <p className="text-neutral-500 mt-1.5 text-sm">
              {formCount > 0
                ? `${formCount} of 2 forms · ${Object.values(counts).reduce((a, b) => a + b, 0)} total responses`
                : 'Create your first form to get started'}
            </p>
          </div>

          {isAtLimit ? (
            <a
              href="https://justforms.gumroad.com/l/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Get unlimited forms →
            </a>
          ) : (
            <form action={createForm}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                New form
              </button>
            </form>
          )}
        </div>

        {isAtLimit && (
          <div className="mb-6 bg-teal-50 border border-teal-100 rounded-xl p-4">
            <p className="text-sm text-teal-900">
              <span className="font-semibold">Free tier limit reached</span> — 2 forms max.
            </p>
            <p className="text-xs text-teal-700 mt-1">
              Want unlimited forms, your own domain, and full control?{' '}
              <a
                href="https://justforms.gumroad.com/l/app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Get the code for $49
              </a>
            </p>
          </div>
        )}

        {formCount === 0 ? (
          <div className="border border-dashed border-neutral-300 rounded-2xl py-24 px-8 text-center bg-white/50">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-7 h-7 text-teal-700" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-medium text-neutral-900 mb-1.5">
              No forms yet
            </h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
              Create your first form and start collecting responses in seconds.
            </p>
            <form action={createForm}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Create a form
              </button>
            </form>
          </div>
        ) : (
          <ul className="grid gap-3">
            {forms?.map((form) => (
              <li
                key={form.id}
                className="group bg-white border border-neutral-200 rounded-xl p-5 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <TitleEditor formId={form.id} initialTitle={form.title} />
                      {form.published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/forms/${form.id}/edit`}
                      className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500 hover:text-teal-700"
                    >
                      <span className="font-mono">/f/{form.slug}</span>
                      <span>·</span>
                      <span>
                        {counts[form.id] || 0}{' '}
                        {counts[form.id] === 1 ? 'response' : 'responses'}
                      </span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/forms/${form.id}/edit`}
                      className="p-2 text-neutral-500 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/responses`}
                      className="p-2 text-neutral-500 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                      title="View responses"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <form
                      action={async () => {
                        'use server';
                        await deleteForm(form.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}