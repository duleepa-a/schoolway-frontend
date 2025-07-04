'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ratingData = [
  { rating: '5 Stars', count: 45 },
  { rating: '4 Stars', count: 32, },
  { rating: '3 Stars', count: 18 },
  { rating: '2 Stars', count: 8,},
  { rating: '1 Star', count: 3, },
];

const DriverRatingChart = () => {
  return (
    <div className="driver-rating-container">
      <span className='flex gap-20'>
        <h3 className="rating-overview-title">Driver Rating Distribution</h3>
      <div className="rating-total">
          <span className="total-label">Total Drivers:</span>
          <span className="total-count">{ratingData.reduce((sum, item) => sum + item.count, 0)}</span>
        </div>
      </span>
      
      <div className="driver-rating-chart-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ratingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="rating" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#1e3a8a" // blue-900
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
        
        
      </div>
    
  );
};

export default DriverRatingChart;
