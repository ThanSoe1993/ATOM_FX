import React, { useState } from 'react';
import { analyzePsychology } from '../services/geminiService';
import { MessageSquare, Zap } from 'lucide-react';

const AICoach: React.FC = () => {
  const [input, setInput] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentLosses, setRecentLosses] = useState(0);

  const getAdvice = async () => {
    if (!input) return;
    setLoading(true);
    const result = await analyzePsychology(input, recentLosses);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
          <Zap size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Psychology & Discipline</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {!advice ? (
          <div className="text-slate-500 text-sm text-center mt-10">
            <p>Feeling FOMO? Revenge trading?</p>
            <p className="mt-2">"Trading is 90% psychology."</p>
            <p className="mt-4 text-xs opacity-70">Check in with the coach before execution.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
               <MessageSquare size={12} /> Coach says:
             </div>
             <p className="text-slate-200 leading-relaxed text-sm md:text-base font-medium">
               {advice}
             </p>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-700">
        <div>
           <label className="text-xs text-slate-400 block mb-1">Consecutive Losses?</label>
           <div className="flex gap-2">
             {[0, 1, 2, 3].map(num => (
               <button
                key={num}
                onClick={() => setRecentLosses(num)}
                className={`flex-1 py-1 text-sm rounded border ${recentLosses === num ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
               >
                 {num === 3 ? '3+' : num}
               </button>
             ))}
           </div>
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I see a setup but the macro trend isn't clear..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none h-20"
        />
        
        <button
          onClick={getAdvice}
          disabled={loading || !input}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Consulting Coach...' : 'Check Mindset'}
        </button>
      </div>
    </div>
  );
};

export default AICoach;