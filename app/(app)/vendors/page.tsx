'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppData } from '@/lib/app-data-context';
import VendorTable from '@/components/VendorTable';
import FilterSheet from '@/components/FilterSheet';

function AllVendorsContent() {
  const { properties } = useAppData();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [filter, setFilter] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const allVendors = useMemo(() => properties.flatMap((p) => p.vendors), [properties]);
  const propertyNameById = useMemo(
    () => Object.fromEntries(properties.map((p) => [p.id, p.name])),
    [properties]
  );

  const isSearching = query.trim().length > 0;

  const visibleVendors = useMemo(() => {
    if (isSearching) {
      const q = query.trim().toLowerCase();
      return allVendors.filter(
        (v) =>
          v.company.toLowerCase().includes(q) ||
          v.service.toLowerCase().includes(q) ||
          (v.phone ?? '').toLowerCase().includes(q) ||
          (propertyNameById[v.property_id] ?? '').toLowerCase().includes(q)
      );
    }
    return filter ? allVendors.filter((v) => v.service === filter) : allVendors;
  }, [allVendors, isSearching, query, filter, propertyNameById]);

  return (
    <div id="view-all-vendors" style={{ display: 'block' }}>
      <div className="pg-title">{isSearching ? 'Search Results' : 'All Vendors'}</div>
      <div className="pg-sub">
        {isSearching
          ? `${visibleVendors.length} result${visibleVendors.length !== 1 ? 's' : ''} for "${query}"`
          : `${visibleVendors.length} vendor${visibleVendors.length !== 1 ? 's' : ''} across all properties`}
      </div>

      {!isSearching && (
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
        </div>
      )}

      <VendorTable vendors={visibleVendors} showProperty propertyNameById={propertyNameById} />

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        vendors={allVendors}
        activeFilter={filter}
        onApply={setFilter}
        onClear={() => setFilter(null)}
      />
    </div>
  );
}

export default function AllVendorsPage() {
  return (
    <Suspense fallback={null}>
      <AllVendorsContent />
    </Suspense>
  );
}
