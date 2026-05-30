-- Run in Supabase SQL Editor if profile save / bookings fail with
-- "Cannot coerce the result to a single JSON object" (usually 0 rows from RLS).

-- Profiles: users read/update own row
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

-- Provider profiles: providers manage own row
create policy "provider_profiles_select_own"
on public.provider_profiles for select
to authenticated
using (auth.uid() = provider_id);

create policy "provider_profiles_update_own"
on public.provider_profiles for update
to authenticated
using (auth.uid() = provider_id)
with check (auth.uid() = provider_id);

create policy "provider_profiles_insert_own"
on public.provider_profiles for insert
to authenticated
with check (auth.uid() = provider_id);

-- Public read for marketplace browse (adjust as needed)
create policy "provider_profiles_select_public"
on public.provider_profiles for select
to anon, authenticated
using (true);

create policy "profiles_select_public"
on public.profiles for select
to anon, authenticated
using (true);
