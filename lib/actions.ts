'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function refresh() {
  revalidatePath('/', 'layout');
}

// ── Properties ──

export async function createProperty(input: {
  name: string;
  address: string;
  city: string;
  units: string;
  floors: string;
  policy: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('properties').insert(input).select().single();
  if (error) throw new Error(error.message);
  refresh();
  return data;
}

export async function updateProperty(
  id: string,
  input: { name: string; address: string; city: string; units: string; floors: string; policy: string }
) {
  const supabase = await createClient();
  const { error } = await supabase.from('properties').update(input).eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

// ── Vendors ──

export async function createVendor(input: {
  property_id: string;
  service: string;
  company: string;
  phone: string;
  alt_phone: string;
  email: string;
  notes: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vendors').insert(input).select().single();
  if (error) throw new Error(error.message);
  refresh();
  return data;
}

export async function updateVendor(
  id: string,
  input: {
    property_id: string;
    service: string;
    company: string;
    phone: string;
    alt_phone: string;
    email: string;
    notes: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from('vendors').update(input).eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteVendor(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('vendors').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

// ── Trustees ──

export async function createTrustee(input: {
  property_id: string;
  name: string;
  email: string;
  home: string;
  cell: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('trustees').insert(input).select().single();
  if (error) throw new Error(error.message);
  refresh();
  return data;
}

export async function updateTrustee(
  id: string,
  input: { name: string; email: string; home: string; cell: string }
) {
  const supabase = await createClient();
  const { error } = await supabase.from('trustees').update(input).eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteTrustee(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('trustees').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}
