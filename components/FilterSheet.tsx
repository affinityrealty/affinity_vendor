'use client';

import { useMemo, useState } from 'react';
import type { Vendor } from '@/lib/types';

export default function FilterSheet({
  open,
  onClose,
  vendors,
  activeFilter,
  onApply,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  vendors: Vendor[];
  activeFilter: string | null;
  onApply: (service: string | null) => void;
  onClear: () => void;
}) {
  const [pending, setPending] = useState<string | null>(activeFilter);

  const services = useMemo(() => {
    const counts: Record<string, number> = {};
    vendors.forEach((v) => {
      counts[v.service] = (counts[v.service] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [vendors]);

  if (!open) return null;

  return (
    <div
      className="sheet-bg on"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="filter-sheet">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">Filter by Service</div>
          <button
            className="sheet-clear"
            onClick={() => {
              setPending(null);
              onClear();
              onClose();
            }}
          >
            Clear
          </button>
        </div>
        <div className="sheet-list">
          {services.map(([service, count]) => (
            <div
              key={service}
              className={`sheet-item${pending === service ? ' on' : ''}`}
              onClick={() => setPending(service)}
            >
              <div className="sheet-item-left">
                <div className="sheet-item-dot" />
                <div className="sheet-item-label">{service}</div>
              </div>
              <span className="sheet-item-count">{count}</span>
            </div>
          ))}
        </div>
        <div className="sheet-footer">
          <button
            className="sheet-apply"
            onClick={() => {
              onApply(pending);
              onClose();
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
