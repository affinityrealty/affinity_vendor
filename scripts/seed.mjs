// One-time data migration: parses the DATA array out of the original single-file
// HTML app and loads it into Supabase. Run once after the schema/RLS migration
// (supabase/migration.sql) has been applied.
//
// Usage:
//   node --env-file=.env.local scripts/seed.mjs
//   node --env-file=.env.local scripts/seed.mjs --force   (re-seed even if properties already exist)
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
// The service-role key bypasses RLS for this bulk load and is never used by the app itself.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes('--force');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Run with: node --env-file=.env.local scripts/seed.mjs'
  );
  process.exit(1);
}

function parseSourceData() {
  const htmlPath = path.join(__dirname, 'source-data.html');
  const html = readFileSync(htmlPath, 'utf8');
  const match = html.match(/const DATA=(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error(`Could not find "const DATA=[...]" in ${htmlPath}`);
  }
  return JSON.parse(match[1]);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const data = parseSourceData();
  console.log(
    `Parsed ${data.length} properties, ${data.reduce((a, p) => a + p.vendors.length, 0)} vendors, ` +
      `${data.reduce((a, p) => a + (p.trustees?.length ?? 0), 0)} trustees from source-data.html`
  );

  const { count, error: countError } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true });
  if (countError) throw new Error(`Failed checking existing data: ${countError.message}`);
  if (count && count > 0 && !force) {
    console.error(
      `properties table already has ${count} row(s). Refusing to re-seed.\n` +
        'Pass --force if you really want to insert on top of existing data.'
    );
    process.exit(1);
  }

  const propertyRows = data.map((p) => ({
    name: p.property,
    address: p.address || null,
    city: p.city || null,
    units: p.units || null,
    floors: p.floors || null,
    policy: p.policy || null,
  }));

  console.log(`Inserting ${propertyRows.length} properties...`);
  const { data: insertedProperties, error: propError } = await supabase
    .from('properties')
    .insert(propertyRows)
    .select('id, name');
  if (propError) throw new Error(`Failed inserting properties: ${propError.message}`);

  const idByName = new Map(insertedProperties.map((p) => [p.name, p.id]));

  const vendorRows = [];
  const trusteeRows = [];
  for (const p of data) {
    const propertyId = idByName.get(p.property);
    if (!propertyId) {
      console.warn(`No inserted id found for property "${p.property}", skipping its vendors/trustees.`);
      continue;
    }
    for (const v of p.vendors ?? []) {
      vendorRows.push({
        property_id: propertyId,
        service: v.service || '',
        company: v.company || '',
        phone: v.phone || null,
        alt_phone: v.alt_phone || null,
        email: v.email || null,
        notes: v.notes || null,
      });
    }
    for (const t of p.trustees ?? []) {
      trusteeRows.push({
        property_id: propertyId,
        name: t.name || '',
        email: t.email || null,
        home: t.home || null,
        cell: t.cell || null,
      });
    }
  }

  console.log(`Inserting ${vendorRows.length} vendors...`);
  for (const batch of chunk(vendorRows, 100)) {
    const { error } = await supabase.from('vendors').insert(batch);
    if (error) throw new Error(`Failed inserting vendors batch: ${error.message}`);
  }

  console.log(`Inserting ${trusteeRows.length} trustees...`);
  for (const batch of chunk(trusteeRows, 100)) {
    const { error } = await supabase.from('trustees').insert(batch);
    if (error) throw new Error(`Failed inserting trustees batch: ${error.message}`);
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
