import { RegistroCobranza, Totales } from './types';

/** Formato argentino: miles con punto, decimales con coma (ej. 100.000,00) */
export const formatARNumber = (value: number, decimals = 2): string => {
  if (!isFinite(value)) return decimals > 0 ? '0,' + '0'.repeat(decimals) : '0';
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const formatted = decimals > 0 ? `${intFormatted},${decPart}` : intFormatted;
  return value < 0 ? `-${formatted}` : formatted;
};

/** Parsea texto con formato argentino a número */
export const parseARNumber = (input: string): number => {
  if (!input?.trim()) return 0;
  const s = input.trim().replace(/\s/g, '').replace(/[^\d.,-]/g, '');
  if (!s || s === '-' || s === ',' || s === '.') return 0;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  let normalized: string;

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      normalized = s.slice(0, lastComma).replace(/\./g, '') + '.' + s.slice(lastComma + 1);
    } else {
      normalized = s.slice(0, lastDot).replace(/,/g, '') + '.' + s.slice(lastDot + 1);
    }
  } else if (lastComma !== -1) {
    normalized = s.slice(0, lastComma) + '.' + s.slice(lastComma + 1);
  } else if (lastDot !== -1) {
    const parts = s.split('.');
    const last = parts[parts.length - 1];
    if (parts.length > 2 || (parts.length === 2 && last.length === 3)) {
      normalized = parts.join('');
    } else if (parts.length === 2 && last.length <= 2) {
      normalized = parts[0] + '.' + last;
    } else {
      normalized = parts.join('');
    }
  } else {
    normalized = s;
  }

  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
};

/** Solo permite caracteres válidos mientras se escribe */
export const filterARInput = (raw: string): string =>
  raw.replace(/[^\d.,]/g, '');

export const formatDNI = (dni: string): string => {
  const digits = dni.replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseDNI = (input: string): string => input.replace(/\D/g, '');

export const formatCurrency = (val: number): string =>
  '$ ' + formatARNumber(val, 2);

export const parseCurrency = parseARNumber;

export const calcTotales = (registros: RegistroCobranza[]): Totales => ({
  totalCastillo: registros.reduce((s, r) => s + r.cobradoCastillo, 0),
  totalHonorarios: registros.reduce((s, r) => s + r.honorarios, 0),
  totalCobrado: registros.reduce((s, r) => s + r.totalCobrado, 0),
});

export const calcHonorarios = (cobrado: number, pct: number): number =>
  parseFloat(((cobrado * pct) / 100).toFixed(2));

export const calcTotalCobrado = (cobrado: number, honorarios: number): number =>
  parseFloat((cobrado + honorarios).toFixed(2));

export const newId = (): string => Math.random().toString(36).slice(2, 10);

const STORAGE_KEY = 'cobranzas_data';

export const saveToStorage = (data: unknown): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const loadFromStorage = <T>(fallback: T): T => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
};
