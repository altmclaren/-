import React from 'react';
import { StatueDesign, formatCurrency } from '../services/statueCostService';

interface Props {
  design: StatueDesign;
  lastCost?: number;
}

export const StatueCard: React.FC<Props> = ({ design, lastCost }) => {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      <div className="aspect-[3/4] lg:aspect-auto">
        <img
          src={design.imageUrl}
          alt={design.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Foam statue · 180 см</p>
          <h2 className="text-3xl font-semibold text-white mt-1">{design.name}</h2>
          <p className="text-slate-300 mt-2 leading-relaxed">{design.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Metric label="Высота" value={`${design.height.toFixed(2)} м`} />
          <Metric label="Ширина" value={`${design.width.toFixed(2)} м`} />
          <Metric label="Глубина" value={`${design.depth.toFixed(2)} м`} />
          <Metric label="Сложность" value={`${(design.complexity * 100).toFixed(0)}%`} />
          <Metric label="Отделка" value={design.surfaceTreatment} full />
          {lastCost !== undefined && (
            <Metric label="Последняя себестоимость" value={formatCurrency(lastCost)} full highlight />
          )}
        </div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; highlight?: boolean; full?: boolean }> = ({
  label,
  value,
  highlight,
  full,
}) => (
  <div className={`flex flex-col gap-1 bg-slate-900/60 border border-slate-700 rounded-xl p-3 ${full ? 'col-span-2' : ''}`}>
    <span className="text-xs uppercase text-slate-400 tracking-[0.15em]">{label}</span>
    <span className={`text-base font-semibold ${highlight ? 'text-emerald-300' : 'text-white'}`}>{value}</span>
  </div>
);
