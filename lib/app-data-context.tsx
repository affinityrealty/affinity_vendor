'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { PropertyWithRelations, Vendor, Property, Trustee } from '@/lib/types';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  createVendor,
  updateVendor,
  deleteVendor,
  createTrustee,
  updateTrustee,
  deleteTrustee,
} from '@/lib/actions';

type ToastState = { message: string; type: 'ok' | 'err'; key: number } | null;

export type ModalState =
  | { type: null }
  | { type: 'vendor'; propertyId?: string; vendor?: Vendor }
  | { type: 'property'; property?: Property }
  | { type: 'trustee'; propertyId: string; trustee?: Trustee };

type AppDataValue = {
  properties: PropertyWithRelations[];
  toast: ToastState;
  showToast: (message: string, type?: 'ok' | 'err') => void;
  modal: ModalState;
  openVendorModal: (opts: { propertyId?: string; vendor?: Vendor }) => void;
  openPropertyModal: (opts?: { property?: Property }) => void;
  openTrusteeModal: (opts: { propertyId: string; trustee?: Trustee }) => void;
  closeModal: () => void;
  saveVendor: (input: {
    id?: string;
    property_id: string;
    service: string;
    company: string;
    phone: string;
    alt_phone: string;
    email: string;
    notes: string;
  }) => Promise<void>;
  removeVendor: (vendor: Vendor) => Promise<void>;
  saveProperty: (input: {
    id?: string;
    name: string;
    address: string;
    city: string;
    units: string;
    floors: string;
    policy: string;
  }) => Promise<void>;
  removeProperty: (property: Property) => Promise<void>;
  saveTrustee: (input: {
    id?: string;
    property_id: string;
    name: string;
    email: string;
    home: string;
    cell: string;
  }) => Promise<void>;
  removeTrustee: (trustee: Trustee) => Promise<void>;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({
  initialProperties,
  children,
}: {
  initialProperties: PropertyWithRelations[];
  children: ReactNode;
}) {
  const router = useRouter();
  const properties = initialProperties;
  const [toast, setToast] = useState<ToastState>(null);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'ok' | 'err' = 'ok') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const closeModal = useCallback(() => setModal({ type: null }), []);

  const openVendorModal = useCallback(
    (opts: { propertyId?: string; vendor?: Vendor }) =>
      setModal({ type: 'vendor', propertyId: opts.propertyId, vendor: opts.vendor }),
    []
  );
  const openPropertyModal = useCallback(
    (opts?: { property?: Property }) => setModal({ type: 'property', property: opts?.property }),
    []
  );
  const openTrusteeModal = useCallback(
    (opts: { propertyId: string; trustee?: Trustee }) =>
      setModal({ type: 'trustee', propertyId: opts.propertyId, trustee: opts.trustee }),
    []
  );

  const saveVendor: AppDataValue['saveVendor'] = useCallback(
    async (input) => {
      try {
        if (input.id) {
          await updateVendor(input.id, input);
          showToast('Vendor updated');
        } else {
          await createVendor(input);
          showToast('Vendor added');
        }
        closeModal();
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast, closeModal]
  );

  const removeVendor = useCallback(
    async (vendor: Vendor) => {
      if (!confirm(`Delete ${vendor.company} (${vendor.service})?`)) return;
      try {
        await deleteVendor(vendor.id);
        showToast('Vendor deleted');
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast]
  );

  const saveProperty: AppDataValue['saveProperty'] = useCallback(
    async (input) => {
      try {
        if (input.id) {
          await updateProperty(input.id, input);
          showToast('Property updated');
        } else {
          await createProperty(input);
          showToast('Property added');
        }
        closeModal();
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast, closeModal]
  );

  const removeProperty = useCallback(
    async (property: Property) => {
      if (
        !confirm(
          `Delete ${property.name}? This also deletes all its vendors and trustees. This cannot be undone.`
        )
      )
        return;
      try {
        await deleteProperty(property.id);
        showToast('Property deleted');
        router.push('/');
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast]
  );

  const saveTrustee: AppDataValue['saveTrustee'] = useCallback(
    async (input) => {
      try {
        if (input.id) {
          await updateTrustee(input.id, input);
          showToast('Trustee updated');
        } else {
          await createTrustee(input);
          showToast('Trustee added');
        }
        closeModal();
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast, closeModal]
  );

  const removeTrustee = useCallback(
    async (trustee: Trustee) => {
      if (!confirm(`Remove trustee ${trustee.name}?`)) return;
      try {
        await deleteTrustee(trustee.id);
        showToast('Trustee removed');
        router.refresh();
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Something went wrong', 'err');
      }
    },
    [router, showToast]
  );

  return (
    <AppDataContext.Provider
      value={{
        properties,
        toast,
        showToast,
        modal,
        openVendorModal,
        openPropertyModal,
        openTrusteeModal,
        closeModal,
        saveVendor,
        removeVendor,
        saveProperty,
        removeProperty,
        saveTrustee,
        removeTrustee,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
