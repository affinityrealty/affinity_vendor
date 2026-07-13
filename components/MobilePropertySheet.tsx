'use client';

import { useMemo, useState } from 'react';
import type { PropertyWithRelations } from '@/lib/types';
import { initials } from '@/lib/ui';

export default function MobilePropertySheet({
  open,
  onClose,
  properties,
  activePropertyId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  properties: PropertyWithRelations[];
  activePropertyId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.city ?? '').toLowerCase().includes(q)
    );
  }, [properties, query]);

  return (
    <div
      className={`m-sheet-bg${open ? ' on' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="m-sheet">
        <div className="m-sheet-handle" />
        <div className="m-sheet-hd">
          <div className="m-sheet-lbl">Select a Property</div>
          <input
            type="text"
            className="m-sheet-srch"
            placeholder="Search properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="m-sheet-list">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`m-pi${activePropertyId === p.id ? ' on' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <div className="m-pi-av">{initials(p.name)}</div>
              <div className="m-pi-info">
                <div className="m-pi-name">{p.name}</div>
                <div className="m-pi-city">{p.city}</div>
              </div>
              <span className="m-pi-ct">{p.vendors.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
