'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface ChartPoint {
  date: string;
  requests: number;
  cost: number;
}

interface AnalyticsChartsProps {
  data: ChartPoint[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
      {/* Daily Inference Volume Chart */}
      <div className="p-5 rounded-2xl bg-[#030e1d]/90 border border-[#0d3b66] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              DAILY INFERENCE VOLUME
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">Total processed API requests</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            HTTP 200 INFERENCES
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e355c" opacity={0.4} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="monospace"
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="monospace"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#041224',
                  borderColor: '#0e355c',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
                formatter={(value: any) => [`${value} Inferences`, 'Requests']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#22d3ee"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cyanGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Spend Accrual Chart */}
      <div className="p-5 rounded-2xl bg-[#030e1d]/90 border border-[#0d3b66] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              DAILY SPEND ACCRUAL (USD)
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">Accumulated daily token consumption cost</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            MICRO-SETTLED
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e355c" opacity={0.4} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="monospace"
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="monospace"
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#041224',
                  borderColor: '#0e355c',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
                formatter={(value: any) => [`$${Number(value).toFixed(6)}`, 'Expenditure']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#34d399"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#emeraldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}