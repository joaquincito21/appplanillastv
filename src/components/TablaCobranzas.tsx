import { Pencil, Trash2, Inbox } from 'lucide-react';
import { RegistroCobranza } from '../types';
import { formatARNumber, formatCurrency, formatDNI } from '../utils';

interface Props {
  registros: RegistroCobranza[];
  onEdit: (r: RegistroCobranza) => void;
  onDelete: (id: string) => void;
}

const th =
  'px-4 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap bg-slate-900/90';
const td = 'px-4 py-3.5 text-sm text-slate-200 whitespace-nowrap';
const tdRight = 'px-4 py-3.5 text-sm text-slate-200 whitespace-nowrap text-right tabular-nums';

export default function TablaCobranzas({ registros, onEdit, onDelete }: Props) {
  if (registros.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="p-4 rounded-2xl bg-slate-800/50 mb-4">
          <Inbox className="w-10 h-10 text-slate-600" />
        </div>
        <p className="text-lg font-medium text-slate-300">No hay registros cargados</p>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Usá el botón <span className="text-gold-400 font-medium">Agregar registro</span> para comenzar a cargar cobranzas.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-slate-800">
              <th className={th}>#</th>
              <th className={th}>Fecha</th>
              <th className={th}>Recibo</th>
              <th className={th}>Nombre</th>
              <th className={th}>D.N.I.</th>
              <th className={th}>Factura</th>
              <th className={th}>Instancia</th>
              <th className={`${th} text-right`}>Castillo</th>
              <th className={`${th} text-right`}>Hon. %</th>
              <th className={`${th} text-right`}>Honorarios</th>
              <th className={`${th} text-right`}>Total</th>
              <th className={th}>Cuotas</th>
              <th className={th}>Obs.</th>
              <th className={th}></th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group even:bg-slate-900/20"
              >
                <td className={`${td} text-slate-500`}>{i + 1}</td>
                <td className={td}>
                  {r.fechaCobro
                    ? new Date(r.fechaCobro + 'T00:00:00').toLocaleDateString('es-AR')
                    : '—'}
                </td>
                <td className={td}>{r.nroRecibo || '—'}</td>
                <td className={`${td} font-medium text-white`}>{r.nombreApellido}</td>
                <td className={td}>{formatDNI(r.dni ?? '') || '—'}</td>
                <td className={td}>{r.nroFactura || '—'}</td>
                <td className={td}>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
                      r.instancia === '1° Instancia'
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                        : r.instancia === '2° Instancia'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {r.instancia}
                  </span>
                </td>
                <td className={tdRight}>{formatCurrency(r.cobradoCastillo)}</td>
                <td className={tdRight}>{formatARNumber(r.honorariosPct, 2)}%</td>
                <td className={tdRight}>{formatCurrency(r.honorarios)}</td>
                <td className={`${tdRight} font-semibold text-gold-400`}>
                  {formatCurrency(r.totalCobrado)}
                </td>
                <td className={td}>{r.cuotasPagar || '—'}</td>
                <td className={`${td} max-w-[140px] truncate text-slate-400`} title={r.observacion}>
                  {r.observacion || '—'}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(r)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-gold-500/20 text-slate-400 hover:text-gold-400 transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
