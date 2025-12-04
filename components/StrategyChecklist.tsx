import React, { useState } from 'react';
import { Check, ArrowRight, BrainCircuit, Activity, Layers, Target, ShieldCheck, TrendingUp } from 'lucide-react';
import { ChecklistState } from '../types';
import RiskCalculator from './RiskCalculator';
import { validateSetup } from '../services/geminiService';

interface StrategyChecklistProps {
  onComplete: (data: ChecklistState & { rr: number }) => void;
}

const StrategyChecklist: React.FC<StrategyChecklistProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<ChecklistState>({
    macroTrend: false,
    retracementChoC: false,
    structureShift: false,
    supplyDemandZone: false,
    entryRisk: false,
    pair: '',
    timeframe: '4H'
  });
  const [rr, setRR] = useState(0);
  const [isValidRisk, setIsValidRisk] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  const toggleCheck = (key: keyof ChecklistState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAIValidation = async () => {
    setLoadingAI(true);
    const feedback = await validateSetup(state);
    setAiFeedback(feedback);
    setLoadingAI(false);
  };

  const canProceed = () => {
    switch(step) {
      case 1: return state.macroTrend && state.pair.length > 0;
      case 2: return state.retracementChoC;
      case 3: return state.structureShift;
      case 4: return state.supplyDemandZone;
      case 5: return state.entryRisk && isValidRisk;
      default: return false;
    }
  };

  const steps = [
    { id: 1, title: 'Confirm Macro Trend', icon: Activity, desc: 'Identify the Higher Time Frame trend direction.' },
    { id: 2, title: 'Wait Retracement (COC)', icon: Layers, desc: 'Wait for pullback. Confirm with Change of Character.' },
    { id: 3, title: 'Structure Shift', icon: BrainCircuit, desc: 'Confirm Alignment COC with the Macro Trend.' },
    { id: 4, title: 'Supply & Demand Zone', icon: Target, desc: 'Select the fresh Zone that caused the shift.' },
    { id: 5, title: 'Entry & Risk', icon: ShieldCheck, desc: 'Calculate Lots, Set SL/TP, Manage Risk.' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-indigo-500" />
          Strategy Execution
        </h2>
        <span className="text-xs font-mono text-slate-400">Step {step}/5</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5">
        <div 
          className="bg-indigo-500 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex mb-8 items-center gap-4">
          <div className={`p-3 rounded-full ${canProceed() ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
            {React.createElement(steps[step-1].icon, { size: 28 })}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">{steps[step-1].title}</h3>
            <p className="text-slate-400 text-sm">{steps[step-1].desc}</p>
          </div>
        </div>

        <div className="space-y-6 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Trading Pair</label>
                <input 
                  type="text" 
                  placeholder="e.g. EURUSD"
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white uppercase focus:border-indigo-500 outline-none"
                  value={state.pair}
                  onChange={(e) => setState({...state, pair: e.target.value.toUpperCase()})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Context Timeframe</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none"
                  value={state.timeframe}
                  onChange={(e) => setState({...state, timeframe: e.target.value})}
                >
                  <option value="15M">15 Minute</option>
                  <option value="1H">1 Hour</option>
                  <option value="4H">4 Hour</option>
                  <option value="D1">Daily</option>
                </select>
              </div>
              <div 
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${state.macroTrend ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                onClick={() => toggleCheck('macroTrend')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.macroTrend ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                    {state.macroTrend && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-slate-200 font-medium">I have confirmed the Macro Trend (HTF Structure).</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded border border-slate-700">
                 <strong>Rule:</strong> Do not chase price. Wait for the pullback against the trend. 
                 Look for a counter-trend move (Internal Structure) or initial Change of Character (COC).
               </p>
               <div 
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${state.retracementChoC ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                onClick={() => toggleCheck('retracementChoC')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.retracementChoC ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                    {state.retracementChoC && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-slate-200 font-medium">Retracement started / Internal COC confirmed.</span>
                </div>
              </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded border border-slate-700">
                 <strong>Structure Shift:</strong> The pullback must fail. Price must break structure back in alignment with the Macro Trend (Alignment COC). This confirms the higher low/lower high.
               </p>
               <div 
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${state.structureShift ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                onClick={() => toggleCheck('structureShift')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.structureShift ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                    {state.structureShift && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-slate-200 font-medium">Structure Shift (Alignment COC) confirmed.</span>
                </div>
              </div>
             </div>
          )}

          {step === 4 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-2">
                 <div className="bg-slate-900 p-2 rounded">Is it a fresh/untested Zone?</div>
                 <div className="bg-slate-900 p-2 rounded">Did it cause the Break of Structure?</div>
               </div>
               <div 
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${state.supplyDemandZone ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                onClick={() => toggleCheck('supplyDemandZone')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.supplyDemandZone ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                    {state.supplyDemandZone && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-slate-200 font-medium">Valid Supply/Demand Zone selected.</span>
                </div>
              </div>
             </div>
          )}

          {step === 5 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <RiskCalculator 
                 onRiskCalculated={(calcRR, _, valid) => {
                   setRR(calcRR);
                   setIsValidRisk(valid);
                 }}
               />
               <div 
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${state.entryRisk ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                onClick={() => toggleCheck('entryRisk')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.entryRisk ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                    {state.entryRisk && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-slate-200 font-medium">Entry is set. Risk is managed. I am disciplined.</span>
                </div>
              </div>
             </div>
          )}
        </div>

        {/* AI Validation Area */}
        {step >= 3 && (
          <div className="mb-6">
             {!aiFeedback ? (
               <button 
                onClick={handleAIValidation}
                disabled={loadingAI}
                className="text-xs flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/30 px-3 py-2 rounded border border-indigo-500/30"
               >
                 <BrainCircuit size={16} />
                 {loadingAI ? "Analyzing Strategy..." : "Validate Setup with AI Coach"}
               </button>
             ) : (
               <div className="bg-indigo-950/50 border border-indigo-500/30 p-3 rounded text-sm text-indigo-200">
                 <strong className="block mb-1 text-indigo-400 flex items-center gap-2">
                   <BrainCircuit size={14}/> Coach Feedback
                 </strong>
                 {aiFeedback}
               </div>
             )}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-slate-700">
          <button 
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded font-medium ${step === 1 ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-white'}`}
          >
            Back
          </button>
          
          {step < 5 ? (
             <button 
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
                canProceed() 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={() => onComplete({...state, rr})}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
                canProceed() 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Log Trade <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyChecklist;