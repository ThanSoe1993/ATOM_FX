import React from 'react';
import { Trade, Outcome, Direction } from '../types';
import { TrendingUp, TrendingDown, MoreHorizontal, Calendar, Tag } from 'lucide-react';

interface JournalProps {
  trades: Trade[];
}

const Journal: React.FC<JournalProps> = ({ trades }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="text-emerald-500" />
          Trade Journal
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
          Entries: {trades.length}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {trades.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10">
            <MoreHorizontal size={48} className="mb-4 opacity-20" />
            <p>No trades logged yet.</p>
            <p className="text-sm">Complete the S&D checklist to add an entry.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 sticky top-0">
              <tr>
                <th className="p-3 font-medium">Pair / Timeframe</th>
                <th className="p-3 font-medium">Direction</th>
                <th className="p-3 font-medium text-right">R:R</th>
                <th className="p-3 font-medium">Outcome</th>
                <th className="p-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {trades.slice().reverse().map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-700/50 transition-colors group cursor-pointer">
                  <td className="p-3">
                    <div className="font-bold text-slate-200">{trade.pair}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                       <Tag size={10} />
                       {trade.tags.join(', ')}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      trade.direction === Direction.LONG ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {trade.direction === Direction.LONG ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {trade.direction}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-300">{trade.riskReward}R</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.outcome === Outcome.WIN ? 'text-emerald-400' : 
                      trade.outcome === Outcome.LOSS ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {trade.outcome}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-500 text-xs">
                    {new Date(trade.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Journal;