import { Download } from 'lucide-react';
import { RegistroCobranza, Totales } from '../types';
import { formatARNumber } from '../utils';

interface Props {
  registros: RegistroCobranza[];
  totales: Totales;
  nroPlanilla: string;
  fechaRendicion: string;
}

export default function ExportButton({ registros, totales, nroPlanilla, fechaRendicion }: Props) {
  const handleExport = () => {
    const headers = [
      '#', 'Fecha Cobro', 'N° Recibo', 'Nombre y Apellido', 'N° Factura', 'Instancia',
      'Cobrado P/ Castillo', 'Hon. %', 'Honorarios', 'Total Cobrado', 'Cuotas', 'Observacion'
    ];

    const rows = registros.map((r, i) => [
      i + 1,
      r.fechaCobro ? new Date(r.fechaCobro + 'T00:00:00').toLocaleDateString('es-AR') : '',
      r.nroRecibo,
      r.nombreApellido,
      r.nroFactura,
      r.instancia,
      formatARNumber(r.cobradoCastillo, 2),
      formatARNumber(r.honorariosPct, 2) + '%',
      formatARNumber(r.honorarios, 2),
      formatARNumber(r.totalCobrado, 2),
      r.cuotasPagar,
      r.observacion,
    ]);

    const escape = (v: unknown) => {
      const s = String(v ?? '');
      if (s.includes(';') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csv = [
      `Planilla N°: ${nroPlanilla};Fecha de Rendicion: ${fechaRendicion}`,
      '',
      headers.join(';'),
      ...rows.map(r => r.map(escape).join(';')),
      '',
      `Total Castillo;${formatARNumber(totales.totalCastillo, 2)}`,
      `Total Honorarios;${formatARNumber(totales.totalHonorarios, 2)}`,
      `Total Cobrado;${formatARNumber(totales.totalCobrado, 2)}`,
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planilla_cobranzas_${nroPlanilla || 'sin_numero'}_${fechaRendicion || 'sin_fecha'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={registros.length === 0}
      className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-navy-600 disabled:hover:text-cream-200"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </button>
  );
}
