import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PublicForm from './form';

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: form } = await supabase
    .from('forms')
    .select('id, title, slug, published')
    .eq('slug', slug)
    .single();

  if (!form || !form.published) notFound();

  const { data: blocks } = await supabase
    .from('blocks')
    .select('id, type, label, required, options, position')
    .eq('form_id', form.id)
    .order('position', { ascending: true });

  return (
    <PublicForm
      formId={form.id}
      title={form.title}
      blocks={(blocks || []).map((b) => ({
        id: b.id,
        type: b.type as any,
        label: b.label || '',
        required: b.required || false,
        options: (b.options as string[] | null) || [],
      }))}
    />
  );
}
