"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateForecast, Transaction } from '@/lib/data';

interface ChartProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const bal = payload[0].value;
    return (
      <div className="bg-white p-3 border rounded shadow-lg z-50">
        <p className="font-bold">{label}</p>
        <p className={bal < 0 ? "text-red-600" : "text-green-600"}>
          Balance: {bal.toLocaleString()} ₸
        </p>
        {bal < 0 && <p className="text-xs text-red-500 font-bold">⚠️ CASH GAP!</p>}
      </div>
    );
  }
  return null;
};

export default function CashflowChart({ transactions }: ChartProps) {
  const data = calculateForecast(transactions);

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Cashflow Forecast (15 days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{fontSize: 12}} />
          <YAxis tick={{fontSize: 12}} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#2563eb" 
            fillOpacity={1} 
            fill="url(#colorBal)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}