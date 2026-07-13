import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppDataProvider } from '@/lib/app-data-context';
import AppShell from '@/components/AppShell';
import type { PropertyWithRelations } from '@/lib/types';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // proxy.ts (middleware) already called auth.getUser() to revalidate the
  // session against Supabase for this exact request before any protected
  // route is allowed to render — re-validating here would be a second,
  // redundant network round-trip on every navigation. getClaims() verifies
  // the JWT signature locally (cached JWKS) instead of calling the Auth API.
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData) redirect('/login');
  const email = (claimsData.claims.email as string | undefined) ?? '';

  const { data, error } = await supabase
    .from('properties')
    .select('*, vendors(*), trustees(*)')
    .order('service', { referencedTable: 'vendors' })
    .order('name', { referencedTable: 'trustees' })
    .order('name');

  if (error) throw new Error(error.message);

  const properties = (data ?? []) as PropertyWithRelations[];

  return (
    <AppDataProvider initialProperties={properties}>
      <AppShell userEmail={email}>{children}</AppShell>
    </AppDataProvider>
  );
}
