import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { useState } from 'react';

const earningsData = [
  { month: 'May', earnings: 25000, lastYear: 15000 },
  { month: 'Jun', earnings: 14000, lastYear: 18000 },
  { month: 'Jul', earnings: 16000, lastYear: 20000 },
  { month: 'Aug', earnings: 23000, lastYear: 15000 },
  { month: 'Sep', earnings: 22000, lastYear: 17000 },
  { month: 'Oct', earnings: 24000, lastYear: 16000 },
];

const EarningsChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mar 2022 - Oct 2022');
  const [activeDataset, setActiveDataset] = useState('current');

  const formatTooltip = (value:number, name:string) => {
    if (name === 'earnings') return [`$${(value / 1000).toFixed(0)}k`, 'Last 6 months'];
    if (name === 'lastYear') return [`$${(value / 1000).toFixed(0)}k`, 'Same period last year'];
    return [value, name];
  };

  const formatYAxisLabel = (value:number) => {
    return `$${value / 1000}k`;
  };

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
            <option>Mar 2022 - Oct 2022</option>
            <option>Jan 2022 - Aug 2022</option>
            <option>May 2022 - Dec 2022</option>
          </select>
        </div>
        
        <div className="flex items-center gap-6 ml-2.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Last 6 months</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-600">Same period last year</span>
          </div>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f1f5f9" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={formatYAxisLabel}
              domain={[0, 30000]}
              ticks={[0, 10000, 20000, 30000]}
            />
            
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="lastYear"
              stroke="#9ca3af"
              strokeWidth={2}
              fill="url(#colorLastYear)"
              strokeDasharray="5 5"
            />
            
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorEarnings)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;