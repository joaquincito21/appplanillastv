import { Instancia } from '../types';

interface Props {
  active: Instancia | 'todas' | 'Residuales';
  onChange: (v: Instancia | 'todas' | 'Residuales') => void;
}

const options: { value: Instancia | 'todas' | 'Residuales'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: '1° Instancia', label: '1° Instancia' },
  { value: '2° Instancia', label: '2° Instancia' },
  { value: 'Residuales', label: 'Residuales' },
];

export default function InstanciaSelector({ active, onChange }: Props) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-800/80 gap-0.5 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === o.value
              ? 'bg-gold-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
