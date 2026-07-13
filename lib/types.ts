export type Property = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  units: string | null;
  floors: string | null;
  policy: string | null;
  created_at: string;
};

export type Vendor = {
  id: string;
  property_id: string;
  service: string;
  company: string;
  phone: string | null;
  alt_phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export type Trustee = {
  id: string;
  property_id: string;
  name: string;
  email: string | null;
  home: string | null;
  cell: string | null;
  created_at: string;
};

export type PropertyWithRelations = Property & {
  vendors: Vendor[];
  trustees: Trustee[];
};
