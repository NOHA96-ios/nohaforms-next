'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type BlockInput = {
  type: string;
  label: string;
  required: boolean;
  options: string[];
};

export async function saveForm(
  formId: string,
  title: string,
  blocks: BlockInput[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error: formError } = await supabase
    .from('forms')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', formId)
    .eq('user_id', user.id);
  if (formError) throw new Error(formError.message);

  const { error: deleteError } = await supabase
    .from('blocks')
    .delete()
    .eq('form_id', formId);
  if (deleteError) throw new Error(deleteError.message);

  if (blocks.length > 0) {
    const rows = blocks.map((b, i) => ({
      form_id: formId,
      type: b.type,
      label: b.label,
      required: b.required,
      options: b.options,
      position: i,
    }));
    const { error: insertError } = await supabase.from('blocks').insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath(`/dashboard/forms/${formId}/edit`);
  revalidatePath('/dashboard');
}

export async function togglePublish(formId: string, published: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('forms')
    .update({ published })
    .eq('id', formId)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/forms/${formId}/edit`);
}