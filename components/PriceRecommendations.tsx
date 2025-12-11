import React from 'react';
import { formatCurrency } from '../services/statueCostService';

interface PriceOption {
  multiplier: number;
  price: number;
  label: string;
  note: string;
}

interface Props {
  options: PriceOption[];
}

export const PriceRecommendations: React.FC<Props> = ({ options }) => {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-indigo-300">Коммерческая стоимость</p>
        <h3 className="text-2xl font-semibold text-white">Диапазоны продажи</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option.multiplier} className="p-4 rounded-xl bg-slate-900/70 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">{option.label}</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(option.price)}</p>
            <p className="text-xs text-slate-400 mt-2">Множитель: {option.multiplier.toFixed(1)}×</p>
            <p className="text-sm text-emerald-300 mt-2">{option.note}</p>
          </div>
        ))}
      </div>
      <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-3 text-sm text-emerald-200">
        Совет: удерживайте маржу выше 5x, если требуется монтаж на площадке и транспорт с сопровождением.
      </div>
    </div>
  );
};
