'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/app-data-context';

export default function TrusteeModal() {
  const { modal, closeModal, saveTrustee } = useAppData();
  const trustee = modal.type === 'trustee' ? modal.trustee : undefined;
  const modalPropertyId = modal.type === 'trustee' ? modal.propertyId : undefined;
  const isEdit = Boolean(trustee);

  const [name, setName] = useState(trustee?.name ?? '');
  const [email, setEmail] = useState(trustee?.email ?? '');
  const [home, setHome] = useState(trustee?.home ?? '');
  const [cell, setCell] = useState(trustee?.cell ?? '');
  const [saving, setSaving] = useState(false);

  if (modal.type !== 'trustee') return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await saveTrustee({
      id: trustee?.id,
      property_id: modalPropertyId!,
      name: name.trim(),
      email: email.trim(),
      home: home.trim(),
      cell: cell.trim(),
    });
    setSaving(false);
  }

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-hd">
          <div className="modal-title">{isEdit ? 'Edit Trustee' : 'Add Trustee'}</div>
        </div>
        <div className="modal-body">
          <div className="fr">
            <label className="flbl">Name</label>
            <input className="finput" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="fr">
            <label className="flbl">Email</label>
            <input className="finput" placeholder="Optional" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="fr2" style={{ marginBottom: 0 }}>
            <div>
              <label className="flbl">Home Phone</label>
              <input className="finput" placeholder="Optional" value={home} onChange={(e) => setHome(e.target.value)} />
            </div>
            <div>
              <label className="flbl">Cell Phone</label>
              <input className="finput" placeholder="Optional" value={cell} onChange={(e) => setCell(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Trustee'}
          </button>
        </div>
      </div>
    </div>
  );
}
