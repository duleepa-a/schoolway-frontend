'use client';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { useState } from 'react';

interface ChartPoint {
  month: string;
  earnings: number;
  lastYear?: number;
}

interface EarningsChartProps {
  data: ChartPoint[];
}

const EarningsChart = ({ data }: EarningsChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 months');

  const formatTooltip = (value:number, name:string) => {
    if (name === 'earnings') return [`LKR ${value.toLocaleString()}`, 'Earnings'];
    if (name === 'lastYear') return [`LKR ${value.toLocaleString()}`, 'Last year'];
    return [value, name];
  };

  const formatYAxisLabel = (value:number) => {
    return `LKR ${value.toLocaleString()}`;
  };

  const chartData = data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Earning Summary</h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option>Last 6 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
        
        <div className="flex items-center gap-6 ml-2.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">This period</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={formatYAxisLabel} />
            
            <Tooltip formatter={formatTooltip} labelStyle={{ color: '#374151' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            
            <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={3} fill="url(#colorEarnings)" dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;