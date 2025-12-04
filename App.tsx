import React, { useState, useEffect } from 'react';
import StrategyChecklist from './components/StrategyChecklist';
import Journal from './components/Journal';
import AICoach from './components/AICoach';
import Dashboard from './components/Dashboard';
import { Trade, ChecklistState, Outcome, Direction } from './types';
import { LayoutDashboard, CheckCircle } from 'lucide-react';
import { generateJournalInsights } from './services/geminiService';

export default function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [view, setView] = useState<'dashboard' | 'checklist'>('checklist');
  const [insight, setInsight] = useState<string>('');

  // Initial mock data
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1', pair: 'EURUSD', date: new Date().toISOString(),
        direction: Direction.SHORT, entryPrice: 1.0950, stopLoss: 1.0970, takeProfit: 1.0910,
        riskReward: 2, outcome: Outcome.WIN, notes: 'Clear 4H Supply with ChoC.', tags: [], checklistCompleted: true
      },
      {
        id: '2', pair: 'GBPUSD', date: new Date(Date.now() - 86400000).toISOString(),
        direction: Direction.LONG, entryPrice: 1.2650, stopLoss: 1.2630, takeProfit: 1.2700,
        riskReward: 2.5, outcome: Outcome.LOSS, notes: 'News spike hit SL.', tags: [], checklistCompleted: true
      }
    ];
    setTrades(mockTrades);
    
    // Auto-generate insights on load
    if(process.env.API_KEY) {
      generateJournalInsights(mockTrades).then(setInsight);
    }
  }, []);

  const handleChecklistComplete = (data: ChecklistState & { rr: number }) => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      pair: data.pair,
      date: new Date().toISOString(),
      direction: Direction.LONG, // Defaulting for demo, in real app user would select
      entryPrice: 0, // In real app, passed from calc
      stopLoss: 0,
      takeProfit: 0,
      riskReward: data.rr,
      outcome: Outcome.PENDING,
      notes: 'Generated via Strategy Checklist',
      tags: [data.timeframe],
      checklistCompleted: true
    };
    
    setTrades([newTrade, ...trades]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">FX<span className="text-indigo-500">Titan</span></h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setView('checklist')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'checklist' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Checklist
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Journal & Stats
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Main Functional Area */}
          <div className="lg:col-span-2 space-y-6">
            {view === 'checklist' ? (
              <StrategyChecklist onComplete={handleChecklistComplete} />
            ) : (
              <>
                <Dashboard trades={trades} />
                <Journal trades={trades} />
              </>
            )}
          </div>

          {/* Right Column: AI Coach & Insights */}
          <div className="lg:col-span-1 space-y-6">
            <AICoach />
            
            {/* Quick Insight Box */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-xl p-5 shadow-lg">
              <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle size={14} /> Weekly Insight
              </h3>
              <p className="text-sm text-slate-300 italic">
                {insight || "Analyzing your trading patterns..."}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}