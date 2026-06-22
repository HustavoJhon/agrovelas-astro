import crypto from 'node:crypto';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return dateStr;
  }
}

export function mapToObj(arr: string[], valFn: (key: string) => string): Record<string, string> {
  const obj: Record<string, string> = {};
  arr.forEach((k) => {
    obj[k] = valFn(k);
  });
  return obj;
}

export function buildRow(
  headers: string[],
  idFn: (h: string) => string | undefined,
  data: Record<string, string | number>
): string[] {
  return headers.map((h) => {
    const id = idFn(h);
    if (id !== undefined) return id;
    return data[h] !== undefined ? String(data[h]) : '';
  });
}
