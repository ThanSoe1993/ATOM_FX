import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Trade, Outcome } from '../types';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const wins = trades.filter(t => t.outcome === Outcome.WIN).length;
  const losses = trades.filter(t => t.outcome === Outcome.LOSS).length;
  const total = wins + losses; // Ignore pending/BE for simple winrate
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  const data = [
    { name: 'Wins', value: wins, color: '#10b981' },
    { name: 'Losses', value: losses, color: '#f43f5e' },
  ];

  // Mock performance over last 5 trades
  const performanceData = trades.slice(-5).map((t, i) => ({
    name: `T${i+1}`,
    pnl: t.outcome === Outcome.WIN ? t.riskReward : t.outcome === Outcome.LOSS ? -1 : 0
  }));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Win Rate</h3>
        <div className="text-2xl font-bold text-white">{winRate}%</div>
        <div className="text-xs text-slate-500 mt-1">{wins}W - {losses}L</div>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Trades</h3>
        <div className="text-2xl font-bold text-white">{trades.length}</div>
        <div className="text-xs text-slate-500 mt-1">Lifetime</div>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg col-span-2 flex items-center justify-between">
         <div className="h-24 w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <Bar dataKey="pnl" fill="#6366f1" radius={[2, 2, 0, 0]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: 'transparent'}}
                />
              </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="h-24 w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;