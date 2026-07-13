'use client';

import type { Vendor } from '@/lib/types';
import { serviceColorClass, phoneLinks } from '@/lib/ui';
import { useAppData } from '@/lib/app-data-context';

function PhoneCell({ value }: { value: string | null }) {
  const numbers = phoneLinks(value);
  if (!numbers.length) return <span className="ph-none">—</span>;
  return (
    <>
      {numbers.map((n, i) => (
        <span key={n}>
          <a className="ph" href={`tel:${n}`}>
            {n}
          </a>
          {i < numbers.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function VendorTable({
  vendors,
  showProperty,
  propertyNameById,
}: {
  vendors: Vendor[];
  showProperty: boolean;
  propertyNameById?: Record<string, string>;
}) {
  const { openVendorModal, removeVendor } = useAppData();

  if (!vendors.length) {
    return (
      <div className="tbl-wrap">
        <div className="empty">
          <div className="empty-ico">📋</div>
          <div className="empty-ttl">No vendors</div>
          <div className="empty-sub">Try a different filter</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tbl-wrap">
        <table className="vtbl">
          <thead>
            <tr>
              <th>Service</th>
              <th>Company</th>
              {showProperty && <th>Property</th>}
              <th>Phone</th>
              {!showProperty && <th>Alt. Phone</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>
                  <span className={`svc-badge ${serviceColorClass(v.service)}`}>{v.service}</span>
                </td>
                <td>
                  <span className="co">{v.company}</span>
                </td>
                {showProperty && (
                  <td style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-2)' }}>
                    {propertyNameById?.[v.property_id] ?? '—'}
                  </td>
                )}
                <td>
                  <PhoneCell value={v.phone} />
                </td>
                {!showProperty && (
                  <td>
                    <PhoneCell value={v.alt_phone} />
                  </td>
                )}
                <td>
                  <div className="row-btns">
                    <button
                      className="rbtn rbtn-edit"
                      onClick={() => openVendorModal({ propertyId: v.property_id, vendor: v })}
                    >
                      Edit
                    </button>
                    <button className="rbtn rbtn-del" onClick={() => removeVendor(v)}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="m-cards">
        {vendors.map((v) => (
          <div className="vmc" key={v.id}>
            <span className={`vmc-svc ${serviceColorClass(v.service)}`}>{v.service}</span>
            <div className="vmc-name">{v.company}</div>
            {showProperty && (
              <div className="vmc-row">
                <span className="vmc-ico">🏢</span>
                <span className="vmc-prop">{propertyNameById?.[v.property_id] ?? '—'}</span>
              </div>
            )}
            <div className="vmc-row">
              <span className="vmc-ico">☎</span>
              {v.phone ? (
                <a className="vmc-ph" href={`tel:${v.phone}`}>
                  {v.phone}
                </a>
              ) : (
                <span className="vmc-nil">No phone on file</span>
              )}
            </div>
            {v.alt_phone && (
              <div className="vmc-row">
                <span className="vmc-ico">☎</span>
                <a className="vmc-ph" href={`tel:${v.alt_phone}`}>
                  {v.alt_phone}
                </a>
              </div>
            )}
            <div className="vmc-btns">
              <button
                className="vmc-btn vmc-edit"
                onClick={() => openVendorModal({ propertyId: v.property_id, vendor: v })}
              >
                Edit
              </button>
              <button className="vmc-btn vmc-del" onClick={() => removeVendor(v)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
