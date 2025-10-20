'use client';

import React from 'react';

interface ChartData {
  month: string;
  revenue: number;
  paymentCount: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h4>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
          <div className="flex items-end justify-between h-64 gap-2">
            {data.map((item, index) => {
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative group">
                    <div
                      className="bg-gradient-to-t rounded-t-lg w-full min-h-[4px] transition-all duration-300"
                      style={{ 
                        height: `${height}px`,
                        background: 'linear-gradient(to top, #00d4aa, #00bcd4)'
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    <div className="font-medium">{item.month.split(' ')[0]}</div>
                    <div className="text-gray-500">{item.month.split(' ')[1]}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>{formatCurrency(maxRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
