'use client';

import { useEffect, useState } from 'react';
import { useAppData } from '@/lib/app-data-context';

export default function Toast() {
  const { toast } = useAppData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(false), 2400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast${visible ? ' show' : ''}${toast.type === 'err' ? ' err' : ''}`}>
      {toast.message}
    </div>
  );
}
