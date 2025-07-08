'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Has vehicle', value: 8, color: '#FbbF24' },
    { name: 'No Vehicle', value: 4, color: '#1e3a8a' } // blue-900
];

const COLORS = ['#FbbF24', '#1e3a8a',];

const DriverOverviewChart = () => {
  return (
    <div className="driver-overview-container">
      <h3 className="driver-overview-title">Driver Applications</h3>
      
      <div className="driver-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="driver-stats-summary">
        {data.map((item, index) => (
          <div key={index} className="driver-stat-item">
            <div 
              className="driver-stat-indicator" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="driver-stat-label">{item.name}</span>
            <span className="driver-stat-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverOverviewChart;
