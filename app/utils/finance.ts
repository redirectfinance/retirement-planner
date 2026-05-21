// 🎂 Calculate exact age in years (with decimals)
export function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays / 365.25;
}

// 🧾 Retirement input structure
export interface RetirementInput {
  dailyIncomeTarget: number;   // 👈 lifestyle goal (per day)
  currentSavings: number;      // 👈 existing capital
  monthlyInvestment: number;   // 👈 contribution per month
  expectedReturn: number;      // 👈 annual %
  inflationRate: number;       // 👈 annual %
}

// 📊 Retirement result structure
export interface RetirementResult {
  targetWealth: number;
  yearsRequired: number;
  realReturnPercent: number;
}

// 💰 Core retirement calculation
export function calculateRetirement(
  inputs: RetirementInput
): RetirementResult | null {

  const {
    dailyIncomeTarget,
    currentSavings,
    monthlyInvestment,
    expectedReturn,
    inflationRate,
  } = inputs;



  
  // 🧮 Annual lifestyle need
  const annualNeeded = dailyIncomeTarget * 365.25;

  

  // 📈 Convert to real return (inflation-adjusted)
  const rNominal = expectedReturn / 100;
  const inflation = inflationRate / 100;

  const rAnnual = (1 + rNominal) / (1 + inflation) - 1;

  if (rAnnual <= 0) return null;

  // 🎯 Required wealth to sustain lifestyle forever
  const targetWealth = annualNeeded / rAnnual;

  // 💵 Monthly compounding
  const rMonthly = rAnnual / 12;

  const P = currentSavings;
  const PMT = monthlyInvestment;
  const FV = targetWealth;

  const numerator = Math.log((PMT + rMonthly * FV) / (PMT + rMonthly * P));
  const denominator = Math.log(1 + rMonthly);

  if (denominator === 0) return null;

  const yearsRequired = numerator / denominator / 12;

  

  return {
    targetWealth,
    yearsRequired,
    realReturnPercent: rAnnual * 100,
  };
}

// 📈 Chart data
export interface ProjectionPoint {
  year: number;
  wealth: number;
}

// 📈 Generate projection (stops exactly at target)
export function generateProjection(
  currentSavings: number,
  monthlyInvestment: number,
  realReturnPercent: number,
  targetWealth: number
): ProjectionPoint[] {

  const data: ProjectionPoint[] = [];

  let wealth = currentSavings;
  const yearlyContribution = monthlyInvestment * 12;
  const r = realReturnPercent / 100;

  let year = 0;

  data.push({ year: 0, wealth });

  while (wealth < targetWealth && year < 100) {
    year++;

    wealth = wealth * (1 + r) + yearlyContribution;

    if (wealth >= targetWealth) {
      wealth = targetWealth;
    }

    data.push({ year, wealth });
  }

  return data;
}