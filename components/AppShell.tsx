'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppData } from '@/lib/app-data-context';
import { createClient } from '@/lib/supabase/client';
import { initials } from '@/lib/ui';
import VendorModal from '@/components/VendorModal';
import PropertyModal from '@/components/PropertyModal';
import TrusteeModal from '@/components/TrusteeModal';
import Toast from '@/components/Toast';
import MobilePropertySheet from '@/components/MobilePropertySheet';

function GlobalSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = pathname === '/vendors' ? searchParams.get('q') ?? '' : '';

  function handleChange(v: string) {
    const params = new URLSearchParams();
    if (v) params.set('q', v);
    router.push(`/vendors${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <div className="d-srch-wrap">
      <span className="d-srch-ico">⌕</span>
      <input
        type="text"
        className="d-srch"
        placeholder="Search vendors, companies, or properties..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

export default function AppShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { properties, openVendorModal, openPropertyModal, modal } = useAppData();

  const [sidebarQuery, setSidebarQuery] = useState('');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const totalVendors = useMemo(() => properties.reduce((a, p) => a + p.vendors.length, 0), [properties]);

  const filteredProperties = useMemo(() => {
    const q = sidebarQuery.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.city ?? '').toLowerCase().includes(q)
    );
  }, [properties, sidebarQuery]);

  const activePropertyId = pathname.startsWith('/properties/') ? pathname.split('/')[2] : null;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="app">
      <header className="d-header">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height header logo, next/image sizing would distort it */}
        <img src="/logo.jpg" className="d-logo" alt="Affinity Realty" />
        <div className="d-sep" />
        <div>
          <div className="d-title">Vendor Directory</div>
          <div className="d-sub">Property Management</div>
        </div>
        <Suspense fallback={<div className="d-srch-wrap" />}>
          <GlobalSearch />
        </Suspense>
        <div className="d-right">
          <div className="d-stats">
            <div className="d-stat">
              <div className="d-stat-val">{properties.length}</div>
              <div className="d-stat-lbl">Properties</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-val">{totalVendors}</div>
              <div className="d-stat-lbl">Vendors</div>
            </div>
          </div>
          <button className="hbtn hbtn-primary" onClick={() => openVendorModal({ propertyId: activePropertyId ?? undefined })}>
            + Add Vendor
          </button>
          <button className="hbtn hbtn-ghost" onClick={handleSignOut} title={userEmail}>
            Sign Out
          </button>
        </div>
      </header>

      <nav className="m-nav" style={{ display: 'none' }}>
        <button className={`m-nav-btn${pathname === '/' ? ' on' : ''}`} onClick={() => router.push('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
          <div className="m-dot" />
        </button>
        <div className="m-nav-sep" />
        <button className="m-nav-btn" onClick={() => setMobileSheetOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Properties
          <div className="m-dot" />
        </button>
        <div className="m-nav-sep" />
        <button
          className={`m-nav-btn${pathname === '/vendors' ? ' on' : ''}`}
          onClick={() => router.push('/vendors')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Vendors
          <div className="m-dot" />
        </button>
        <div className="m-nav-sep" />
        <button className="m-nav-btn" onClick={() => openVendorModal({ propertyId: activePropertyId ?? undefined })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add
          <div className="m-dot" />
        </button>
      </nav>

      <MobilePropertySheet
        open={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        properties={properties}
        activePropertyId={activePropertyId}
        onSelect={(id) => {
          setMobileSheetOpen(false);
          router.push(`/properties/${id}`);
        }}
      />

      <div className="d-body">
        <aside className="sidebar">
          <div className="sb-head">
            <div className="sb-head-row">
              <span className="sb-lbl">Properties</span>
              <span
                className="sb-pill"
                style={{ cursor: 'pointer' }}
                title="Add a property"
                onClick={() => openPropertyModal()}
              >
                {properties.length} · +
              </span>
            </div>
            <input
              type="text"
              className="sb-srch"
              placeholder="Filter properties..."
              value={sidebarQuery}
              onChange={(e) => setSidebarQuery(e.target.value)}
            />
          </div>
          <div className="prop-list">
            {filteredProperties.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className={`pi${activePropertyId === p.id ? ' on' : ''}`}
              >
                <div className="pi-av">{initials(p.name)}</div>
                <div className="pi-info">
                  <div className="pi-name">{p.name}</div>
                  <div className="pi-city">{p.city}</div>
                </div>
                <span className="pi-ct">{p.vendors.length}</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="d-main">{children}</div>
      </div>

      {modal.type === 'vendor' && <VendorModal />}
      {modal.type === 'property' && <PropertyModal />}
      {modal.type === 'trustee' && <TrusteeModal />}
      <Toast />
    </div>
  );
}
