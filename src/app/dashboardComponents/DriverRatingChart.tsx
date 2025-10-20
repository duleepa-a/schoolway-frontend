"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Star, Users } from "lucide-react";

type RatingItem = { rating: string; count: number };

const fallbackRatingData: RatingItem[] = [
  { rating: "5 Stars", count: 0 },
  { rating: "4 Stars", count: 0 },
  { rating: "3 Stars", count: 0 },
  { rating: "2 Stars", count: 0 },
  { rating: "1 Star", count: 0 },
];

const DriverRatingChart = ({ data }: { data?: RatingItem[] }) => {
  const ratingData = data && data.length ? data : fallbackRatingData;
  const totalDrivers = ratingData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Star className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Driver Rating Distribution
            </h3>
            <p className="text-gray-500 text-sm">
              Distribution of driver ratings
            </p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[#0099cc]" />
            <span className="text-[#0099cc] font-medium">
              {totalDrivers} Drivers
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ratingData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
            <XAxis
              dataKey="rating"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
              formatter={(value) => [`${value} drivers`, "Count"]}
              labelStyle={{ fontWeight: 600, color: "#374151" }}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-2 pt-4 border-t border-gray-100">
        {ratingData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < parseInt(item.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-lg font-bold text-gray-800">{item.count}</div>
            <div className="text-xs text-gray-500">drivers</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverRatingChart;
