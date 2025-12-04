import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface RiskCalculatorProps {
  onRiskCalculated: (rr: number, riskAmount: number, valid: boolean) => void;
}

const RiskCalculator: React.FC<RiskCalculatorProps> = ({ onRiskCalculated }) => {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);

  const riskAmount = (accountBalance * riskPercent) / 100;

  const calculateMetrics = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return { rr: 0, lots: 0 };
    
    const riskPips = Math.abs(entryPrice - stopLoss);
    const rewardPips = Math.abs(takeProfit - entryPrice);
    
    if (riskPips === 0) return { rr: 0, lots: 0 };
    
    const calculatedRR = parseFloat((rewardPips / riskPips).toFixed(2));
    
    // Standard Lot Calculation Estimation (Assuming USD Quote Currency for simplicity in demo)
    // Formula: Units = RiskAmount / Distance
    // Standard Lot = 100,000 units
    const units = riskAmount / riskPips;
    const lots = units / 100000;

    return { rr: calculatedRR, lots: parseFloat(lots.toFixed(2)) };
  };

  const { rr, lots } = calculateMetrics();
  const isValid = rr >= 2 && entryPrice > 0; // Strategy requires at least 1:2

  useEffect(() => {
    onRiskCalculated(rr, riskAmount, isValid);
  }, [rr, riskAmount, isValid, onRiskCalculated]);

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-slate-200">Forex Position Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Balance</label>
          <div className="relative">
             <DollarSign size={14} className="absolute left-2 top-2 text-slate-500" />
             <input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded pl-7 pr-2 py-1 text-sm text-slate-200"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Risk %</label>
          <input
            type="number"
            step="0.1"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200"
          />
        </div>
      </div>

      <div className="h-px bg-slate-700 my-2" />

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Entry Price</label>
          <input
            type="number"
            step="0.0001"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none"
            placeholder="0.0000"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Stop Loss</label>
          <input
            type="number"
            step="0.0001"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-rose-300 focus:border-rose-500 outline-none"
            placeholder="0.0000"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Take Profit</label>
          <input
            type="number"
            step="0.0001"
            value={takeProfit}
            onChange={(e) => setTakeProfit(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-emerald-300 focus:border-emerald-500 outline-none"
            placeholder="0.0000"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
        <div>
          <div className="text-xs text-slate-500">Risk Amount</div>
          <div className="font-mono text-rose-400 font-bold">${riskAmount.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Lot Size</div>
          <div className="font-mono text-indigo-400 font-bold text-lg">{lots > 0 ? lots : '-'}</div>
          <div className="text-[10px] text-slate-600">Standard Lots</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Risk : Reward</div>
          <div className={`font-mono font-bold text-lg ${rr >= 2 ? 'text-emerald-400' : 'text-orange-400'}`}>
            1 : {rr}
          </div>
        </div>
      </div>

      {rr > 0 && rr < 2 && (
        <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-400/10 p-2 rounded">
          <AlertTriangle className="w-4 h-4" />
          <span>Strategy Requirement: Min 1:2 R:R.</span>
        </div>
      )}
       {rr >= 2 && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 p-2 rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span>Risk parameters accepted.</span>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;