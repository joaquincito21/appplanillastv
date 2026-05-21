import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { RegistroCobranza, DatosGenerales } from '../types';
import { calcTotales, getRegistrosParaExport } from '../utils';
import { exportPlanillaExcel } from '../utils/exportPlanillaExcel';

interface Props {
  registros: RegistroCobranza[];
  nroPlanilla: string;
  fechaRendicion: string;
  instanciaFiltro: DatosGenerales['instanciaFiltro'];
}

export default function ExportButton({
  registros,
  nroPlanilla,
  fechaRendicion,
  instanciaFiltro,
}: Props) {
  const [exporting, setExporting] = useState(false);
  const registrosExport = useMemo(
    () => getRegistrosParaExport(registros, instanciaFiltro),
    [registros, instanciaFiltro]
  );
  const totalesExport = useMemo(() => calcTotales(registrosExport), [registrosExport]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPlanillaExcel(
        registrosExport,
        totalesExport,
        nroPlanilla,
        fechaRendicion,
        instanciaFiltro
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={registrosExport.length === 0 || exporting}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
        border border-slate-700/80 bg-slate-900/60 text-slate-300 text-sm font-medium
        hover:border-gold-600/50 hover:text-gold-400 hover:bg-slate-800/50
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-700
        transition-all duration-200"
      title={
        instanciaFiltro === 'Residuales'
          ? 'Exporta todos los registros de Residuales'
          : 'Exporta 1° y 2° instancia en la misma planilla'
      }
    >
      <Download className="w-4 h-4" />
      {exporting ? 'Exportando…' : 'Exportar Excel'}
    </button>
  );
}
