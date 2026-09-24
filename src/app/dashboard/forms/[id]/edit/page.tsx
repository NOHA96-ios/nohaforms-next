import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Editor from './editor';

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: form } = await supabase
    .from('forms')
    .select('id, title, slug, published')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!form) notFound();

  const { data: blocks } = await supabase
    .from('blocks')
    .select('id, type, label, required, options, position')
    .eq('form_id', id)
    .order('position', { ascending: true });

  return (
    <Editor
      formId={form.id}
      initialTitle={form.title}
      initialSlug={form.slug}
      initialPublished={form.published}
      initialBlocks={(blocks || []).map((b) => ({
        id: b.id,
        type: b.type,
        label: b.label || '',
        required: b.required || false,
        options: (b.options as string[] | null) || [],
      }))}
    />
  );
}