export type StatueDesign = {
  name: string;
  description: string;
  height: number; // meters
  width: number; // meters
  depth: number; // meters
  complexity: number; // 0.5 - 1.2 multiplier
  surfaceTreatment: string;
  imageUrl: string;
};

export type CostBreakdown = {
  foamBlocks: number;
  foamCost: number;
  machiningHours: number;
  machiningCost: number;
  energyCost: number;
  toolWearCost: number;
  finishingCost: number;
  paintMaterialsCost: number;
  paintLaborCost: number;
  bondingCost: number;
  overheadCost: number;
  safetyReserve: number;
  totalCost: number;
};

const BLOCK_PRICE = 75;
const BLOCK_VOLUME = 2 * 0.6 * 1.2; // m3 for one foam block
const ROBOT_POWER_KW = 6; // average draw for KR210-R2700 during cutting
const ENERGY_RATE = 0.12; // $/kWh
const MACHINING_RATE = 42; // operator + amortization per hour
const TOOL_WEAR_RATE = 12; // per machining hour
const FINISHING_RATE = 30; // per hour

const round = (value: number) => Math.round(value * 100) / 100;

export function generateRandomDesign(): StatueDesign {
  const seeds = [
    "guardian", "minimalist", "renaissance", "spiral", "totem", "windswept", "mythic", "flow" ,"kinetic"
  ];
  const names = [
    "Киностраж", "Авангардный Страж", "Северный Вихрь", "Пластика Света", "Спираль Роста", "Лунный Тотем"
  ];
  const treatments = [
    "грунт + акрил + матовый лак",
    "грунт + перламутровая эмаль",
    "армировка стеклосеткой + акрил",
    "фасадная шпатлевка + полиуретановый лак"
  ];

  const height = 1.8;
  const width = round(0.45 + Math.random() * 0.25);
  const depth = round(0.4 + Math.random() * 0.25);
  const complexity = round(0.7 + Math.random() * 0.5);
  const seed = seeds[Math.floor(Math.random() * seeds.length)];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    description:
      "Свободно стоящая пенный скульптура высотой 180 см с продуманной геометрией для точной резки роботом KUKA.",
    height,
    width,
    depth,
    complexity,
    surfaceTreatment: treatments[Math.floor(Math.random() * treatments.length)],
    imageUrl: `https://picsum.photos/seed/${seed}${Date.now()}/900/1200`,
  };
}

export function calculateCosts(design: StatueDesign): CostBreakdown {
  const usableVolume = design.height * design.width * design.depth * 1.08; // добавляем запас 8%
  const foamBlocks = Math.max(1, Math.ceil(usableVolume / BLOCK_VOLUME));
  const foamCost = foamBlocks * BLOCK_PRICE;

  const machiningHours = round(2.2 + design.complexity * 1.1 + foamBlocks * 0.35);
  const machiningCost = round(machiningHours * MACHINING_RATE);
  const toolWearCost = round(machiningHours * TOOL_WEAR_RATE);

  const energyCost = round(machiningHours * ROBOT_POWER_KW * ENERGY_RATE);

  const surfaceArea =
    2 * (design.height * design.width + design.height * design.depth + design.width * design.depth);
  const paintMaterialsCost = round(surfaceArea * 8 + foamBlocks * 10);
  const paintLaborHours = round(1.4 + design.complexity * 0.6);
  const paintLaborCost = round(paintLaborHours * FINISHING_RATE);

  const bondingCost = round(foamBlocks * 14);
  const finishingCost = round((1.1 + design.complexity * 0.8) * FINISHING_RATE);

  const subtotal =
    foamCost + machiningCost + energyCost + toolWearCost + finishingCost + paintMaterialsCost + paintLaborCost + bondingCost;
  const overheadCost = round(subtotal * 0.15);
  const safetyReserve = round(subtotal * 0.08);

  const totalCost = round(subtotal + overheadCost + safetyReserve);

  return {
    foamBlocks,
    foamCost,
    machiningHours,
    machiningCost,
    energyCost,
    toolWearCost,
    finishingCost,
    paintMaterialsCost,
    paintLaborCost,
    bondingCost,
    overheadCost,
    safetyReserve,
    totalCost,
  };
}

export function buildPriceOptions(totalCost: number) {
  const multipliers = [4, 5, 6, 6.5];
  return multipliers.map((multiplier) => ({
    multiplier,
    price: round(totalCost * multiplier),
    label: multiplier === 6.5 ? "премиум с монтажом" : `x${multiplier.toFixed(0)}`,
    note:
      multiplier >= 6
        ? "для уникальных площадок и шоу-кейсов"
        : multiplier >= 5
        ? "оптимально для галерей и брендов"
        : "для быстрого выхода на рынок",
  }));
}

export function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
