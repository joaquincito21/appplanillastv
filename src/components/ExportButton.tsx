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
      'Cobrado P/ Castillo', 'Hon. %', 'Honorarios', 'Total Cobrado', 'Cuotas', 'Observación'
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
      `Planilla N°: ${nroPlanilla};Fecha de Rendición: ${fechaRendicion}`,
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
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
        border border-slate-700/80 bg-slate-900/60 text-slate-300 text-sm font-medium
        hover:border-gold-600/50 hover:text-gold-400 hover:bg-slate-800/50
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-700
        transition-all duration-200"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </button>
  );
}
