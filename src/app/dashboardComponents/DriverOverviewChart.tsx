"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, Car, PieChart as PieChartIcon } from "lucide-react";

type OverviewItem = { name: string; value: number; color?: string };

const fallback = [
  { name: "Has vehicle", value: 8, color: "#f59e0b" },
  { name: "No Vehicle", value: 4, color: "#3b82f6" },
];

const COLORS = ["#f59e0b", "#3b82f6"];

const DriverOverviewChart = ({ data }: { data?: OverviewItem[] }) => {
  const chartData = data && data.length ? data : fallback;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PieChartIcon className="w-5 h-5 text-[#0099cc]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Driver Applications Overview
            </h3>
            <p className="text-gray-500 text-sm">
              Breakdown by vehicle ownership
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">{total} Total</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Chart */}
        <div className="flex-1 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color ?? COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => [`${value} drivers`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-4 min-w-40">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      item.color ?? COLORS[index % COLORS.length],
                  }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverOverviewChart;
