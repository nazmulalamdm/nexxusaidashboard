"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { time: "00:00", tokens: 120 },
  { time: "04:00", tokens: 240 },
  { time: "08:00", tokens: 680 },
  { time: "12:00", tokens: 950 },
  { time: "16:00", tokens: 810 },
  { time: "20:00", tokens: 1100 },
  { time: "23:59", tokens: 740 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-white dark:bg-[#2b2c40] p-5 rounded-xl border border-[#ebe9f1] dark:border-slate-700/60">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-xs font-bold text-[#5d596c] dark:text-white">Realtime Inference Velocity</h4>
          <p className="text-[10px] text-slate-400">Token throughput / min across clusters</p>
        </div>
        <span className="text-[9px] font-mono bg-brand-500/10 text-brand-500 font-bold px-2 py-0.5 rounded">
          Live Stream
        </span>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7367f0" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#7367f0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2233', 
                border: '1px solid #334155', 
                borderRadius: '8px', 
                fontSize: '10px',
                color: '#fff' 
              }} 
            />
            <Area type="monotone" dataKey="tokens" stroke="#7367f0" strokeWidth={2} fillOpacity={1} fill="url(#tokenGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}