'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppData } from '@/lib/app-data-context';
import { initials } from '@/lib/ui';

export default function DashboardPage() {
  const router = useRouter();
  const { properties } = useAppData();

  const stats = useMemo(() => {
    const allVendors = properties.flatMap((p) => p.vendors);
    const uniqueCompanies = new Set(allVendors.map((v) => v.company)).size;
    const uniqueServices = new Set(allVendors.map((v) => v.service)).size;
    const withTrustees = properties.filter((p) => p.trustees.length).length;
    return {
      totalVendors: allVendors.length,
      uniqueCompanies,
      uniqueServices,
      withTrustees,
    };
  }, [properties]);

  const kpis: [number, string][] = [
    [properties.length, 'Properties'],
    [stats.totalVendors, 'Vendor Entries'],
    [stats.uniqueCompanies, 'Unique Companies'],
    [stats.uniqueServices, 'Service Types'],
    [stats.withTrustees, 'With Trustees'],
  ];

  return (
    <div id="view-all">
      <div className="pg-title">Portfolio Overview</div>
      <div className="pg-sub">
        {properties.length} properties · {stats.totalVendors} vendor entries · {stats.uniqueCompanies} unique
        companies
      </div>
      <div className="kpi-row">
        {kpis.map(([val, label]) => (
          <div className="kpi" key={label}>
            <div className="kpi-val">{val}</div>
            <div className="kpi-lbl">{label}</div>
          </div>
        ))}
      </div>
      <div className="sec-lbl">All Properties</div>
      <div className="prop-grid">
        {properties.map((p) => (
          <div className="prop-card" key={p.id} onClick={() => router.push(`/properties/${p.id}`)}>
            <div className="pc-head">
              <div className="pc-icon">{initials(p.name)}</div>
              <div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-addr">{[p.address, p.city].filter(Boolean).join(', ') || 'Address not listed'}</div>
              </div>
            </div>
            <div className="pc-tags">
              <span className="tag tag-dk">
                {p.vendors.length} vendor{p.vendors.length !== 1 ? 's' : ''}
              </span>
              {p.units && <span className="tag tag-gr">{p.units} units</span>}
              {p.trustees.length > 0 && (
                <span className="tag tag-gy">
                  {p.trustees.length} trustee{p.trustees.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="pc-rule" />
            {p.vendors.slice(0, 4).map((v) => (
              <div className="pc-vrow" key={v.id}>
                <span className="pc-vsvc">{v.service}</span>
                <span className="pc-vco">{v.company}</span>
              </div>
            ))}
            {p.vendors.length > 4 && <div className="pc-more">+{p.vendors.length - 4} more</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
