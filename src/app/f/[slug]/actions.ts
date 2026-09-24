'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitForm(
  formId: string,
  data: Record<string, string | string[]>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('submissions')
    .insert({ form_id: formId, data });

  if (error) throw new Error(error.message);
}