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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(totales, count).map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-xl p-5 transition-all duration-300 ${
              item.highlight
                ? 'bg-gradient-to-br from-gold-400 to-gold-500 shadow-glow'
                : 'bg-navy-800/60 border border-navy-700/60 hover:border-navy-600'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                item.highlight ? 'text-navy-900/70' : 'text-cream-400'
              }`}>
                {item.label}
              </p>
              <Icon
                className={`w-5 h-5 ${
                  item.highlight ? 'text-navy-900/60' : 'text-navy-600'
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold tabular-nums tracking-tight ${
                item.highlight ? 'text-navy-950' : 'text-cream-100'
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
