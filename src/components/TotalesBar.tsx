import { Receipt, Wallet, TrendingUp, List } from 'lucide-react';
import { Totales } from '../types';
import { formatCurrency } from '../utils';

interface Props {
  totales: Totales;
  count: number;
}

const cards = (totales: Totales, count: number) => [
  { label: 'Registros', value: count.toString(), icon: List, highlight: false },
  { label: 'Total Castillo', value: formatCurrency(totales.totalCastillo), icon: Wallet, highlight: false },
  { label: 'Total Honorarios', value: formatCurrency(totales.totalHonorarios), icon: Receipt, highlight: false },
  { label: 'Total Cobrado', value: formatCurrency(totales.totalCobrado), icon: TrendingUp, highlight: true },
];

export default function TotalesBar({ totales, count }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards(totales, count).map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`card p-4 sm:p-5 transition-all duration-200 ${
              item.highlight
                ? 'border-gold-600/40 bg-gradient-to-br from-gold-500/10 to-transparent shadow-glow'
                : 'hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {item.label}
              </p>
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  item.highlight ? 'text-gold-400' : 'text-slate-600'
                }`}
              />
            </div>
            <p
              className={`text-lg sm:text-xl font-bold tabular-nums tracking-tight ${
                item.highlight ? 'text-gold-400' : 'text-white'
              }`}
            >
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
