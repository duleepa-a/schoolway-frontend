"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type OverviewItem = { name: string; value: number; color?: string };

const fallback = [
  { name: "Has vehicle", value: 8, color: "#FbbF24" },
  { name: "No Vehicle", value: 4, color: "#1e3a8a" },
];

const COLORS = ["#FbbF24", "#1e3a8a"];

const DriverOverviewChart = ({ data }: { data?: OverviewItem[] }) => {
  const chartData = data && data.length ? data : fallback;
  return (
    <div className="driver-overview-container">
      <h3 className="driver-overview-title">Driver Applications</h3>

      <div className="driver-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={50}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color ?? COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="driver-stats-summary">
        {chartData.map((item, index) => (
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
