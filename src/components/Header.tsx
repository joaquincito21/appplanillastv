import { FileText, Calendar } from 'lucide-react';

interface Props {
  nroPlanilla: string;
  fechaRendicion: string;
  onChange: (field: 'nroPlanilla' | 'fechaRendicion', value: string) => void;
}

export default function Header({ nroPlanilla, fechaRendicion, onChange }: Props) {
  return (
    <header className="border-b border-navy-700/60 bg-navy-900/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Logo y titulo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full" />
              <div className="relative w-14 h-14 rounded-full bg-navy-800 border-2 border-gold-400 flex items-center justify-center shadow-glow">
                <span className="text-gold-400 font-serif text-2xl font-bold">C</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-cream-100 tracking-tight">
                Castillo S.A.C.I.F.I.A.
              </h1>
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em] mt-0.5">
                Planilla de cobranzas
              </p>
            </div>
          </div>

          {/* Campos de planilla */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label className="form-label-light flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                N° Planilla
              </label>
              <input
                type="text"
                value={nroPlanilla}
                onChange={e => onChange('nroPlanilla', e.target.value)}
                className="input-field-dark w-32"
                placeholder="000"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label-light flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Fecha de rendicion
              </label>
              <input
                type="date"
                value={fechaRendicion}
                onChange={e => onChange('fechaRendicion', e.target.value)}
                className="input-field-dark"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
