'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FREE_FORM_LIMIT = 2;

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export async function createForm() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Enforce free-tier limit
  const { count } = await supabase
    .from('forms')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((count ?? 0) >= FREE_FORM_LIMIT) {
    throw new Error(
      `Free tier limit reached (${FREE_FORM_LIMIT} forms). Get the full code for $49 to remove this limit.`
    );
  }

  const { data, error } = await supabase
    .from('forms')
    .insert({
      user_id: user.id,
      title: 'Untitled form',
      slug: generateSlug(),
      published: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  redirect(`/dashboard/forms/${data.id}/edit`);
}

export async function deleteForm(formId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function renameForm(formId: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const trimmed = title.trim() || 'Untitled form';

  const { error } = await supabase
    .from('forms')
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq('id', formId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}