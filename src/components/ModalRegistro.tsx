import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { Instancia, RegistroCobranza, DatosGenerales } from '../types';
import { calcHonorarios, calcTotalCobrado, formatDNI, newId, parseDNI } from '../utils';
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
  dni: '',
  nroFactura: '',
  instancia: instanciaPorFiltro(filtro),
  cobradoCastillo: 0,
  honorariosPct: 0,
  cuotasPagar: '',
  observacion: '',
});

const inputClass = (field: string, errors: Record<string, string>) =>
  `input-field ${errors[field] ? 'input-error' : ''}`;

const readOnlyClass =
  'input-field bg-slate-800/60 cursor-not-allowed text-slate-300';

export default function ModalRegistro({ initial, instanciaFiltro, onSave, onClose }: Props) {
  const [form, setForm] = useState(() => {
    if (initial) {
      const instancia =
        instanciaFiltro === 'todas' ? initial.instancia : instanciaPorFiltro(instanciaFiltro);
      return { ...initial, instancia, dni: initial.dni ?? '' };
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
    const dniDigits = parseDNI(form.dni);
    if (dniDigits && (dniDigits.length < 7 || dniDigits.length > 8)) {
      e.dni = 'DNI inválido (7 u 8 dígitos)';
    }
    if (form.cobradoCastillo <= 0) e.cobradoCastillo = 'Debe ser mayor a 0';
    if (form.honorariosPct < 0 || form.honorariosPct > 100) e.honorariosPct = 'Entre 0 y 100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form as RegistroCobranza);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-500/80 font-medium mb-0.5">
              {initial ? 'Modificación' : 'Alta de registro'}
            </p>
            <h2 className="text-white font-semibold text-xl">
              {initial ? 'Editar registro' : 'Nuevo registro'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Fecha de cobro" error={errors.fechaCobro}>
            <input
              type="date"
              value={form.fechaCobro}
              onChange={e => set('fechaCobro', e.target.value)}
              className={inputClass('fechaCobro', errors)}
            />
          </Field>
          <Field label="N° de recibo" error={errors.nroRecibo}>
            <input
              type="text"
              value={form.nroRecibo}
              onChange={e => set('nroRecibo', e.target.value)}
              className={inputClass('nroRecibo', errors)}
              placeholder="Ej: 0001"
            />
          </Field>
          <Field label="Apellido y nombre" error={errors.nombreApellido} full>
            <input
              type="text"
              value={form.nombreApellido}
              onChange={e => set('nombreApellido', e.target.value)}
              className={inputClass('nombreApellido', errors)}
              placeholder="Ej: GARCÍA, JUAN"
            />
          </Field>
          <Field label="D.N.I." error={errors.dni}>
            <input
              type="text"
              inputMode="numeric"
              value={formatDNI(form.dni)}
              onChange={e => set('dni', parseDNI(e.target.value).slice(0, 8))}
              className={inputClass('dni', errors)}
              placeholder="Ej: 31430842"
            />
          </Field>
          <Field label="N° de factura" error={errors.nroFactura}>
            <input
              type="text"
              value={form.nroFactura}
              onChange={e => set('nroFactura', e.target.value)}
              className={inputClass('nroFactura', errors)}
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
                className={inputClass('instancia', errors)}
              >
                {instanciaOpciones.map(op => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Cobrado p/ Castillo" error={errors.cobradoCastillo} hint="$">
            <ARNumberInput
              value={form.cobradoCastillo}
              onChange={v => set('cobradoCastillo', v)}
              className={inputClass('cobradoCastillo', errors)}
              placeholder="0,00"
            />
          </Field>
          <Field label="Honorarios (%)" error={errors.honorariosPct} hint="%">
            <ARNumberInput
              value={form.honorariosPct}
              onChange={v => set('honorariosPct', v)}
              decimals={2}
              className={inputClass('honorariosPct', errors)}
              placeholder="0"
            />
          </Field>
          <Field label="Honorarios" error="" hint="$" computed>
            <ARNumberInput
              value={form.honorarios}
              onChange={() => {}}
              readOnly
              className={`${readOnlyClass} text-gold-300`}
            />
          </Field>
          <Field label="Total cobrado" error="" hint="$" computed highlight>
            <ARNumberInput
              value={form.totalCobrado}
              onChange={() => {}}
              readOnly
              className={`${readOnlyClass} text-gold-400 font-semibold border-gold-600/30`}
            />
          </Field>
          <Field label="Cuotas a pagar" error="">
            <input
              type="text"
              value={form.cuotasPagar}
              onChange={e => set('cuotasPagar', e.target.value)}
              className={inputClass('cuotasPagar', errors)}
              placeholder="Ej: 3"
            />
          </Field>
          <Field label="Observación / autorización" error="" full>
            <input
              type="text"
              value={form.observacion}
              onChange={e => set('observacion', e.target.value)}
              className={inputClass('observacion', errors)}
              placeholder="Notas u observaciones"
            />
          </Field>
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
  hint,
  computed,
  highlight,
  children,
}: {
  label: string;
  error: string;
  full?: boolean;
  hint?: string;
  computed?: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1.5">
        <span>{label}</span>
        {hint && (
          <span className="text-slate-600 font-normal">{hint}</span>
        )}
        {computed && (
          <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
            calculado
          </span>
        )}
        {highlight && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
