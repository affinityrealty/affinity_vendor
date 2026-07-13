import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppDataProvider } from '@/lib/app-data-context';
import AppShell from '@/components/AppShell';
import type { PropertyWithRelations } from '@/lib/types';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

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
      <AppShell userEmail={user.email ?? ''}>{children}</AppShell>
    </AppDataProvider>
  );
}
