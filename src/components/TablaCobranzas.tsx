import { Pencil, Trash2, Inbox } from 'lucide-react';
import { RegistroCobranza } from '../types';
import { formatARNumber, formatCurrency } from '../utils';

interface Props {
  registros: RegistroCobranza[];
  onEdit: (r: RegistroCobranza) => void;
  onDelete: (id: string) => void;
}

const th =
  'px-4 py-4 text-left text-[11px] font-bold text-cream-400 uppercase tracking-wider whitespace-nowrap bg-navy-800/80';
const td = 'px-4 py-4 text-sm text-cream-200 whitespace-nowrap';
const tdRight = 'px-4 py-4 text-sm text-cream-200 whitespace-nowrap text-right tabular-nums';

export default function TablaCobranzas({ registros, onEdit, onDelete }: Props) {
  if (registros.length === 0) {
    return (
      <div className="form-card flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="p-4 rounded-2xl bg-cream-200/50 mb-4">
          <Inbox className="w-12 h-12 text-navy-400" />
        </div>
        <p className="text-xl font-semibold text-navy-700">No hay registros cargados</p>
        <p className="text-sm text-navy-500 mt-2 max-w-sm">
          {"Usa el boton "}<span className="text-gold-500 font-semibold">Agregar registro</span>{" para comenzar a cargar cobranzas."}
        </p>
      </div>
    );
  }

  return (
    <div className="form-card overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-cream-300/50">
              <th className={th}>#</th>
              <th className={th}>Fecha</th>
              <th className={th}>Recibo</th>
              <th className={th}>Nombre</th>
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
          <tbody className="bg-cream-50">
            {registros.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-cream-200/80 hover:bg-cream-200/50 transition-colors group"
              >
                <td className={`${td} text-navy-400 font-medium`}>{i + 1}</td>
                <td className={`${td} text-navy-600`}>
                  {r.fechaCobro
                    ? new Date(r.fechaCobro + 'T00:00:00').toLocaleDateString('es-AR')
                    : '-'}
                </td>
                <td className={`${td} text-navy-600`}>{r.nroRecibo || '-'}</td>
                <td className={`${td} font-semibold text-navy-800`}>{r.nombreApellido}</td>
                <td className={`${td} text-navy-600`}>{r.nroFactura || '-'}</td>
                <td className={td}>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      r.instancia === '1° Instancia'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : r.instancia === '2° Instancia'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {r.instancia}
                  </span>
                </td>
                <td className={`${tdRight} text-navy-700`}>{formatCurrency(r.cobradoCastillo)}</td>
                <td className={`${tdRight} text-navy-600`}>{formatARNumber(r.honorariosPct, 2)}%</td>
                <td className={`${tdRight} text-navy-700`}>{formatCurrency(r.honorarios)}</td>
                <td className={`${tdRight} font-bold text-gold-600`}>
                  {formatCurrency(r.totalCobrado)}
                </td>
                <td className={`${td} text-navy-600`}>{r.cuotasPagar || '-'}</td>
                <td className={`${td} max-w-[140px] truncate text-navy-500`} title={r.observacion}>
                  {r.observacion || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(r)}
                      className="p-2 rounded-lg bg-navy-100 hover:bg-gold-100 text-navy-500 hover:text-gold-600 transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="p-2 rounded-lg bg-navy-100 hover:bg-red-100 text-navy-500 hover:text-red-600 transition-all"
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
