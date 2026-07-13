export function serviceColorClass(svc: string): string {
  const s = svc.toLowerCase();
  if (s.includes('alarm')) return 's-alarm';
  if (s.includes('clean')) return 's-clean';
  if (s.includes('drain')) return 's-drain';
  if (s.includes('electrici') || s.includes('electricity')) return 's-elec';
  if (s.includes('elevator')) return 's-elev';
  if (s.includes('gas')) return 's-gas';
  if (s.includes('hvac') || s.includes('heat')) return 's-hvac';
  if (s.includes('landscap') || s.includes('lawn') || s.includes('irrig')) return 's-land';
  if (s.includes('pest')) return 's-pest';
  if (s.includes('plumb')) return 's-plumb';
  if (s.includes('snow')) return 's-snow';
  if (s.includes('trash') || s.includes('waste')) return 's-trash';
  if (s.includes('water') || s.includes('sewer')) return 's-water';
  return 's-other';
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export function phoneLinks(value: string | null): string[] {
  if (!value) return [];
  return value
    .split('/')
    .map((n) => n.trim())
    .filter(Boolean);
}
