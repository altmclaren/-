import React, { useCallback, useMemo, useState } from 'react';
import {
  buildPriceOptions,
  calculateCosts,
  formatCurrency,
  generateRandomDesign,
  StatueDesign,
  CostBreakdown,
} from './services/statueCostService';
import { StatueCard } from './components/StatueCard';
import { CostBreakdownCard } from './components/CostBreakdown';
import { PriceRecommendations } from './components/PriceRecommendations';
import { SparklesIcon, DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [design, setDesign] = useState<StatueDesign>(() => generateRandomDesign());
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [priceOptions, setPriceOptions] = useState<{ multiplier: number; price: number; label: string; note: string }[] | null>(
    null,
  );

  const handleGenerateDesign = useCallback(() => {
    setDesign(generateRandomDesign());
    setCosts(null);
    setPriceOptions(null);
  }, []);

  const handleCalculateCosts = useCallback(() => {
    const breakdown = calculateCosts(design);
    setCosts(breakdown);
  }, [design]);

  const handleBuildPrices = useCallback(() => {
    if (!costs) return;
    setPriceOptions(buildPriceOptions(costs.totalCost));
  }, [costs]);

  const helperCopy = useMemo(
    () => [
      '• Размеры уже подогнаны под блок 2×0,6×1,2 м и высоту 180 см.',
      '• Калькуляция учитывает стоимость блока $75, электроэнергию KR210-R2700, покраску и резерв 8%.',
      '• После расчёта можно быстро получить диапазоны продажи x4/x5/x6.',
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <header className="text-center space-y-2">
          <p className="text-indigo-300 text-sm uppercase tracking-[0.3em]">KUKA KR210 · Foam Lab</p>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300">
            Калькулятор скульптуры из пенопласта
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Сгенерируйте эскиз статуи высотой до 180 см, посчитайте её себестоимость с учётом робота KUKA и малярных работ,
            а затем получите рекомендованную цену для продажи.
          </p>
        </header>

        <StatueCard design={design} lastCost={costs?.totalCost} />

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-sm text-slate-300">Как пользоваться:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-sm list-disc list-inside">
            {helperCopy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleGenerateDesign}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all"
          >
            <SparklesIcon />
            <span>Сгенерировать эскиз</span>
          </button>
          <button
            onClick={handleCalculateCosts}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all"
          >
            <DownloadIcon />
            <span>Посчитать себестоимость</span>
          </button>
          <button
            onClick={handleBuildPrices}
            disabled={!costs}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold shadow-lg shadow-slate-900/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="text-lg">💰</span>
            <span>Коммерческая цена</span>
          </button>
        </div>

        {costs && <CostBreakdownCard costs={costs} />}
        {priceOptions && <PriceRecommendations options={priceOptions} />}

        {costs && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 text-emerald-100 text-sm">
            Итоговая себестоимость {formatCurrency(costs.totalCost)} включает блоки пенопласта, энергопотребление робота KUKA,
            малярные материалы и резерв на непредвиденные расходы. Повышайте множитель, если требуются усиленная упаковка или
            монтаж на площадке заказчика.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
