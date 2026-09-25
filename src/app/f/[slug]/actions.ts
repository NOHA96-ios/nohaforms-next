'use server';

import { createClient } from '@/lib/supabase/server';

const FREE_RESPONSE_LIMIT = 50;

export async function submitForm(
  formId: string,
  data: Record<string, string | string[]>
) {
  const supabase = await createClient();

  const { count } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('form_id', formId);

  if ((count ?? 0) >= FREE_RESPONSE_LIMIT) {
    throw new Error(
      `This form has reached its free-tier limit of ${FREE_RESPONSE_LIMIT} responses.`
    );
  }

  const { error } = await supabase
    .from('submissions')
    .insert({ form_id: formId, data });

  if (error) throw new Error(error.message);
}