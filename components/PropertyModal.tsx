'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/app-data-context';

export default function PropertyModal() {
  const { modal, closeModal, saveProperty } = useAppData();
  const property = modal.type === 'property' ? modal.property : undefined;
  const isEdit = Boolean(property);

  const [name, setName] = useState(property?.name ?? '');
  const [address, setAddress] = useState(property?.address ?? '');
  const [city, setCity] = useState(property?.city ?? '');
  const [units, setUnits] = useState(property?.units ?? '');
  const [floors, setFloors] = useState(property?.floors ?? '');
  const [policy, setPolicy] = useState(property?.policy ?? '');
  const [saving, setSaving] = useState(false);

  if (modal.type !== 'property') return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await saveProperty({
      id: property?.id,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      units: units.trim(),
      floors: floors.trim(),
      policy: policy.trim(),
    });
    setSaving(false);
  }

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-hd">
          <div className="modal-title">{isEdit ? 'Edit Property' : 'Add Property'}</div>
        </div>
        <div className="modal-body">
          <div className="fr">
            <label className="flbl">Property Name</label>
            <input
              className="finput"
              placeholder="e.g. 1180 Beacon Street"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="fr">
            <label className="flbl">Address</label>
            <input
              className="finput"
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="fr">
            <label className="flbl">City</label>
            <input
              className="finput"
              placeholder="e.g. Boston, MA 02113"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="fr2">
            <div>
              <label className="flbl">Units</label>
              <input className="finput" value={units} onChange={(e) => setUnits(e.target.value)} />
            </div>
            <div>
              <label className="flbl">Floors</label>
              <input className="finput" value={floors} onChange={(e) => setFloors(e.target.value)} />
            </div>
          </div>
          <div className="fr" style={{ marginBottom: 0 }}>
            <label className="flbl">Policy</label>
            <input
              className="finput"
              placeholder="e.g. Unit Owner Responsibility"
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Property'}
          </button>
        </div>
      </div>
    </div>
  );
}
