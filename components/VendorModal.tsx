'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/app-data-context';

const SERVICE_OPTIONS = [
  'Alarm Company- Fire Alarm/Extinguisher',
  'Alarm Company- Fire Alarm',
  'Alarm Company- Sprinkler',
  'Cleaning Service',
  'Drains',
  'Electrician',
  'Electricity',
  'Elevator',
  'Gas Company',
  'Garage Door',
  'HVAC/Heat/Hot Water',
  'Irrigation',
  'Landscaping',
  'Pest Control',
  'Plumbing',
  'Pool',
  'Security',
  'Snow Removal',
  'Trash',
  'Water',
  'Water & Sewer',
];

export default function VendorModal() {
  const { modal, closeModal, saveVendor, properties } = useAppData();
  const vendor = modal.type === 'vendor' ? modal.vendor : undefined;
  const modalPropertyId = modal.type === 'vendor' ? modal.propertyId : undefined;
  const isEdit = Boolean(vendor);

  const [service, setService] = useState(vendor?.service ?? '');
  const [company, setCompany] = useState(vendor?.company ?? '');
  const [phone, setPhone] = useState(vendor?.phone ?? '');
  const [altPhone, setAltPhone] = useState(vendor?.alt_phone ?? '');
  const [email, setEmail] = useState(vendor?.email ?? '');
  const [notes, setNotes] = useState(vendor?.notes ?? '');
  const [propertyId, setPropertyId] = useState(vendor?.property_id ?? modalPropertyId ?? properties[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  if (modal.type !== 'vendor') return null;

  async function handleSave() {
    if (!service.trim() || !company.trim() || !propertyId) return;
    setSaving(true);
    await saveVendor({
      id: vendor?.id,
      property_id: propertyId,
      service: service.trim(),
      company: company.trim(),
      phone: phone.trim(),
      alt_phone: altPhone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });
    setSaving(false);
  }

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-hd">
          <div className="modal-title">{isEdit ? 'Edit Vendor' : 'Add Vendor'}</div>
        </div>
        <div className="modal-body">
          <div className="fr">
            <label className="flbl">Service Category</label>
            <input
              className="finput"
              placeholder="e.g. Plumbing, HVAC..."
              list="svcList"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
            <datalist id="svcList">
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div className="fr">
            <label className="flbl">Company Name</label>
            <input
              className="finput"
              placeholder="Company or contractor name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="fr2">
            <div>
              <label className="flbl">Office Phone</label>
              <input
                className="finput"
                placeholder="617-000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="flbl">Alt. Phone</label>
              <input
                className="finput"
                placeholder="Optional"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="fr">
            <label className="flbl">Email</label>
            <input
              className="finput"
              placeholder="Optional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="fr">
            <label className="flbl">Notes</label>
            <input
              className="finput"
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="fr" style={{ marginBottom: 0 }}>
            <label className="flbl">Property</label>
            <select className="fsel" value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
}
