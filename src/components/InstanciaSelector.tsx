import { Instancia } from '../types';

interface Props {
  active: Instancia | 'todas' | 'Residuales';
  onChange: (v: Instancia | 'todas' | 'Residuales') => void;
}

const options: { value: Instancia | 'todas' | 'Residuales'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: '1° Instancia', label: '1ra Instancia' },
  { value: '2° Instancia', label: '2da Instancia' },
  { value: 'Residuales', label: 'Residuales' },
];

export default function InstanciaSelector({ active, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden border border-navy-700/60 bg-navy-800/60 shadow-card">
      {options.map((o, i) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
            i !== options.length - 1 ? 'border-r border-navy-700/60' : ''
          } ${
            active === o.value
              ? 'bg-cream-100 text-navy-900'
              : 'text-cream-300 hover:text-cream-100 hover:bg-navy-700/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
