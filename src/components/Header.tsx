import { Scale, FileText } from 'lucide-react';

interface Props {
  nroPlanilla: string;
  fechaRendicion: string;
  onChange: (field: 'nroPlanilla' | 'fechaRendicion', value: string) => void;
}

export default function Header({ nroPlanilla, fechaRendicion, onChange }: Props) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full" />
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-glow">
                <Scale className="w-7 h-7 text-slate-950" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Estudio Jurídico <span className="text-gold-400">Castillo</span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Sistema de rendición de cobranzas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="card px-4 py-3 min-w-[140px]">
              <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <FileText className="w-3.5 h-3.5" />
                N° Planilla
              </label>
              <input
                type="text"
                value={nroPlanilla}
                onChange={e => onChange('nroPlanilla', e.target.value)}
                className="input-field py-2 w-full sm:w-36"
                placeholder="000"
              />
            </div>
            <div className="card px-4 py-3">
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">
                Fecha de rendición
              </label>
              <input
                type="date"
                value={fechaRendicion}
                onChange={e => onChange('fechaRendicion', e.target.value)}
                className="input-field py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
