-- JustForms Supabase schema
-- Run this in Supabase SQL Editor

create table forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled form',
  description text,
  slug text unique not null,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index forms_user_id_idx on forms(user_id);
create index forms_slug_idx on forms(slug);

create table blocks (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references forms(id) on delete cascade not null,
  type text not null,
  label text default '',
  required boolean default false,
  options jsonb,
  position int not null default 0,
  created_at timestamptz default now()
);

create index blocks_form_id_idx on blocks(form_id);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references forms(id) on delete cascade not null,
  data jsonb not null,
  created_at timestamptz default now()
);

create index submissions_form_id_idx on submissions(form_id);

alter table forms enable row level security;
alter table blocks enable row level security;
alter table submissions enable row level security;

create policy "owners manage forms"
  on forms for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "public read published forms"
  on forms for select using (published = true);

create policy "owners manage blocks"
  on blocks for all
  using (exists (select 1 from forms where forms.id = blocks.form_id and forms.user_id = auth.uid()))
  with check (exists (select 1 from forms where forms.id = blocks.form_id and forms.user_id = auth.uid()));

create policy "public read blocks of published"
  on blocks for select
  using (exists (select 1 from forms where forms.id = blocks.form_id and forms.published = true));

create policy "anyone can submit"
  on submissions for insert with check (true);

create policy "owners read submissions"
  on submissions for select
  using (exists (select 1 from forms where forms.id = submissions.form_id and forms.user_id = auth.uid()));