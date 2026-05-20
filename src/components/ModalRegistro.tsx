import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { Instancia, RegistroCobranza, DatosGenerales } from '../types';
import { calcHonorarios, calcTotalCobrado, newId } from '../utils';
import ARNumberInput from './ARNumberInput';

interface Props {
  initial?: RegistroCobranza;
  instanciaFiltro: DatosGenerales['instanciaFiltro'];
  onSave: (r: RegistroCobranza) => void;
  onClose: () => void;
}

const instanciaPorFiltro = (filtro: DatosGenerales['instanciaFiltro']): Instancia => {
  if (filtro === 'Residuales') return 'Residuales';
  if (filtro === '1° Instancia') return '1° Instancia';
  if (filtro === '2° Instancia') return '2° Instancia';
  return '1° Instancia';
};

const opcionesInstancia = (filtro: DatosGenerales['instanciaFiltro']): Instancia[] => {
  if (filtro === 'Residuales') return ['Residuales'];
  if (filtro === '1° Instancia') return ['1° Instancia'];
  if (filtro === '2° Instancia') return ['2° Instancia'];
  return ['1° Instancia', '2° Instancia'];
};

const empty = (
  filtro: DatosGenerales['instanciaFiltro']
): Omit<RegistroCobranza, 'id' | 'honorarios' | 'totalCobrado'> => ({
  fechaCobro: '',
  nroRecibo: '',
  nombreApellido: '',
  nroFactura: '',
  instancia: instanciaPorFiltro(filtro),
  cobradoCastillo: 0,
  honorariosPct: 0,
  cuotasPagar: '',
  observacion: '',
});

export default function ModalRegistro({ initial, instanciaFiltro, onSave, onClose }: Props) {
  const [form, setForm] = useState(() => {
    if (initial) {
      const instancia =
        instanciaFiltro === 'todas' ? initial.instancia : instanciaPorFiltro(instanciaFiltro);
      return { ...initial, instancia };
    }
    return { ...empty(instanciaFiltro), id: newId(), honorarios: 0, totalCobrado: 0 };
  });
  const instanciaOpciones = opcionesInstancia(instanciaFiltro);
  const instanciaFija = instanciaFiltro !== 'todas';
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const hon = calcHonorarios(form.cobradoCastillo, form.honorariosPct);
    setForm(f => ({ ...f, honorarios: hon, totalCobrado: calcTotalCobrado(f.cobradoCastillo, hon) }));
  }, [form.cobradoCastillo, form.honorariosPct]);

  const set = (field: keyof typeof form, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fechaCobro) e.fechaCobro = 'Requerido';
    if (!form.nombreApellido.trim()) e.nombreApellido = 'Requerido';
    if (!form.nroRecibo.trim()) e.nroRecibo = 'Requerido';
    if (form.cobradoCastillo <= 0) e.cobradoCastillo = 'Debe ser mayor a 0';
    if (form.honorariosPct < 0 || form.honorariosPct > 100) e.honorariosPct = 'Entre 0 y 100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form as RegistroCobranza);
  };

  const inputClass = (field: string) =>
    `input-field ${errors[field] ? 'input-error' : ''}`;

  const readOnlyClass =
    'input-field bg-cream-200/50 cursor-not-allowed text-navy-600';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-gold-400 font-semibold mb-1">
              {initial ? 'Modificacion' : 'Alta de registro'}
            </p>
            <h2 className="text-cream-100 font-bold text-xl">
              {initial ? 'Editar registro' : 'Nuevo registro'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-cream-100">
          {/* Seccion 1: Datos principales */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="section-badge">1</span>
              <span className="text-sm font-bold text-gold-600 uppercase tracking-wider">
                Datos principales
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fecha de cobro" error={errors.fechaCobro}>
                <input
                  type="date"
                  value={form.fechaCobro}
                  onChange={e => set('fechaCobro', e.target.value)}
                  className={inputClass('fechaCobro')}
                />
              </Field>
              <Field label="N° de recibo" error={errors.nroRecibo}>
                <input
                  type="text"
                  value={form.nroRecibo}
                  onChange={e => set('nroRecibo', e.target.value)}
                  className={inputClass('nroRecibo')}
                  placeholder="Ej: 0001"
                />
              </Field>
              <Field label="Nombre y apellido" error={errors.nombreApellido} full>
                <input
                  type="text"
                  value={form.nombreApellido}
                  onChange={e => set('nombreApellido', e.target.value)}
                  className={inputClass('nombreApellido')}
                  placeholder="Ej: Garcia, Juan"
                />
              </Field>
              <Field label="N° de factura" error="">
                <input
                  type="text"
                  value={form.nroFactura}
                  onChange={e => set('nroFactura', e.target.value)}
                  className={inputClass('nroFactura')}
                  placeholder="Ej: A-0001"
                />
              </Field>
              <Field label="Instancia" error="">
                {instanciaFija ? (
                  <input
                    type="text"
                    value={form.instancia}
                    readOnly
                    className={readOnlyClass}
                  />
                ) : (
                  <select
                    value={form.instancia}
                    onChange={e => set('instancia', e.target.value as Instancia)}
                    className={inputClass('instancia')}
                  >
                    {instanciaOpciones.map(op => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
          </div>

          {/* Seccion 2: Montos */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="section-badge">2</span>
              <span className="text-sm font-bold text-gold-600 uppercase tracking-wider">
                Montos
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cobrado p/ Castillo ($)" error={errors.cobradoCastillo}>
                <ARNumberInput
                  value={form.cobradoCastillo}
                  onChange={v => set('cobradoCastillo', v)}
                  className={inputClass('cobradoCastillo')}
                  placeholder="0,00"
                />
              </Field>
              <Field label="Honorarios (%)" error={errors.honorariosPct}>
                <ARNumberInput
                  value={form.honorariosPct}
                  onChange={v => set('honorariosPct', v)}
                  decimals={2}
                  className={inputClass('honorariosPct')}
                  placeholder="0"
                />
              </Field>
              <Field label="Honorarios ($)" computed>
                <ARNumberInput
                  value={form.honorarios}
                  onChange={() => {}}
                  readOnly
                  className={`${readOnlyClass} text-navy-700 font-medium`}
                />
              </Field>
              <Field label="Total cobrado ($)" computed highlight>
                <ARNumberInput
                  value={form.totalCobrado}
                  onChange={() => {}}
                  readOnly
                  className={`${readOnlyClass} text-gold-600 font-bold border-gold-400/50`}
                />
              </Field>
            </div>
          </div>

          {/* Seccion 3: Adicionales */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="section-badge">3</span>
              <span className="text-sm font-bold text-gold-600 uppercase tracking-wider">
                Adicionales
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cuotas a pagar" error="">
                <input
                  type="text"
                  value={form.cuotasPagar}
                  onChange={e => set('cuotasPagar', e.target.value)}
                  className={inputClass('cuotasPagar')}
                  placeholder="Ej: 3"
                />
              </Field>
              <Field label="Observacion / autorizacion" error="" full>
                <input
                  type="text"
                  value={form.observacion}
                  onChange={e => set('observacion', e.target.value)}
                  className={inputClass('observacion')}
                  placeholder="Notas u observaciones"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  computed,
  highlight,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  computed?: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
        <span>{label}</span>
        {computed && (
          <span className="text-[10px] uppercase tracking-wider text-navy-400 bg-cream-200 px-2 py-0.5 rounded">
            calculado
          </span>
        )}
        {highlight && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
