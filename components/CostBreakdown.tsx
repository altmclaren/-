import React from 'react';
import { CostBreakdown, formatCurrency } from '../services/statueCostService';

interface Props {
  costs: CostBreakdown;
}

export const CostBreakdownCard: React.FC<Props> = ({ costs }) => {
  const rows = [
    { label: 'Блоки пенопласта', value: `${costs.foamBlocks} шт`, price: costs.foamCost },
    { label: 'Фрезеровка роботом (часы)', value: `${costs.machiningHours} ч`, price: costs.machiningCost },
    { label: 'Износ инструмента', value: '', price: costs.toolWearCost },
    { label: 'Электроэнергия (KR210-R2700)', value: '', price: costs.energyCost },
    { label: 'Сборка и клеевые работы', value: '', price: costs.bondingCost },
    { label: 'Финишная обработка', value: '', price: costs.finishingCost },
    { label: 'Материалы для покраски', value: '', price: costs.paintMaterialsCost },
    { label: 'Малярные работы', value: '', price: costs.paintLaborCost },
    { label: 'Накладные расходы 15%', value: '', price: costs.overheadCost },
    { label: 'Резерв 8%', value: '', price: costs.safetyReserve },
  ];

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-300">Себестоимость</p>
          <h3 className="text-2xl font-semibold text-white">Полный расклад</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">итого</p>
          <p className="text-3xl font-bold text-emerald-300">{formatCurrency(costs.totalCost)}</p>
        </div>
      </div>
      <div className="divide-y divide-slate-700">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="text-white">{row.label}</p>
              {row.value && <p className="text-slate-400 text-xs">{row.value}</p>}
            </div>
            <p className="text-white font-semibold">{formatCurrency(row.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
