'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppData } from '@/lib/app-data-context';
import { initials } from '@/lib/ui';
import VendorTable from '@/components/VendorTable';
import FilterSheet from '@/components/FilterSheet';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { properties, openVendorModal, openPropertyModal, openTrusteeModal, removeTrustee, removeProperty } =
    useAppData();
  const [filter, setFilter] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const property = properties.find((p) => p.id === id);

  const filteredVendors = useMemo(() => {
    if (!property) return [];
    return filter ? property.vendors.filter((v) => v.service === filter) : property.vendors;
  }, [property, filter]);

  if (!property) {
    return (
      <div id="view-property" style={{ display: 'flex' }}>
        <div className="empty">
          <div className="empty-ico">🔍</div>
          <div className="empty-ttl">Property not found</div>
          <div className="empty-sub">It may have been deleted.</div>
        </div>
      </div>
    );
  }

  const serviceCount = new Set(property.vendors.map((v) => v.service)).size;

  return (
    <div id="view-property" style={{ display: 'flex' }}>
      <div className="prop-banner">
        <div className="pb-top">
          <div className="pb-icon">{initials(property.name)}</div>
          <div className="pb-info">
            <div className="pb-name">{property.name}</div>
            <div className="pb-addr">
              {[property.address, property.city].filter(Boolean).join(' · ') || 'Address not on file'}
            </div>
            <div className="pb-badges">
              <span className="pb-badge">
                {property.vendors.length} Vendor{property.vendors.length !== 1 ? 's' : ''}
              </span>
              {property.units && <span className="pb-badge">{property.units} Units</span>}
              {property.floors && <span className="pb-badge">{property.floors}</span>}
              {property.policy && <span className="pb-badge">{property.policy}</span>}
            </div>
          </div>
          <div className="pb-actions">
            <button className="btn-back" onClick={() => router.push('/')}>
              ← All Properties
            </button>
            <button className="btn-add-v" onClick={() => openPropertyModal({ property })}>
              Edit Property
            </button>
            <button className="btn-add-v" onClick={() => openVendorModal({ propertyId: property.id })}>
              + Add Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="stats-strip">
        {[
          [property.vendors.length, 'Vendors'],
          [serviceCount, 'Service Types'],
          [property.units || '—', 'Units'],
          [property.trustees.length, 'Trustees'],
        ].map(([val, label]) => (
          <div className="pstat" key={label as string}>
            <div className="pstat-val">{val}</div>
            <div className="pstat-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="trustees-bar" style={{ display: 'block' }}>
        <div className="trustees-title">
          <span>Board of Trustees</span>
          <button className="trustee-ibtn" onClick={() => openTrusteeModal({ propertyId: property.id })}>
            + Add Trustee
          </button>
        </div>
        {property.trustees.length > 0 && (
          <div className="trustee-cards">
            {property.trustees.map((t) => (
              <div className="trustee-card" key={t.id}>
                <div className="trustee-av">
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="trustee-name">{t.name}</div>
                  {t.email && <div className="trustee-email">{t.email}</div>}
                  {(t.home || t.cell) && (
                    <div className="trustee-ph">{[t.home, t.cell].filter(Boolean).join(' · ')}</div>
                  )}
                </div>
                <div className="trustee-btns">
                  <button
                    className="trustee-ibtn"
                    onClick={() => openTrusteeModal({ propertyId: property.id, trustee: t })}
                  >
                    Edit
                  </button>
                  <button className="trustee-ibtn" onClick={() => removeTrustee(t)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="vendor-section">
        <div className="filter-bar">
          <button className={`filter-btn${filter ? ' has-filter' : ''}`} onClick={() => setSheetOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            {filter || 'Filter by Service'}
          </button>
          {filter && (
            <button className="filter-clear show" onClick={() => setFilter(null)}>
              Clear
            </button>
          )}
          <span className="vs-ct">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
          </span>
        </div>

        <VendorTable vendors={filteredVendors} showProperty={false} />
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        vendors={property.vendors}
        activeFilter={filter}
        onApply={setFilter}
        onClear={() => setFilter(null)}
      />

      <div style={{ padding: '0 26px 26px' }}>
        <button className="rbtn rbtn-del" onClick={() => removeProperty(property)}>
          Delete This Property
        </button>
      </div>
    </div>
  );
}
