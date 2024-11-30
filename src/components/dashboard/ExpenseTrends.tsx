import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Category } from '../../types/expense';
import { formatCurrency } from '../../utils/formatCurrency';

interface TrendData {
  month: string;
  total: number;
  food: number;
  transport: number;
  utilities: number;
  entertainment: number;
  shopping: number;
  health: number;
  other: number;
}

const CATEGORY_COLORS: Record<Category, string> = {
  food: '#ef4444',
  transport: '#3b82f6',
  utilities: '#10b981',
  entertainment: '#8b5cf6',
  shopping: '#f59e0b',
  health: '#ec4899',
  other: '#6b7280'
};

interface ExpenseTrendsProps {
  data: TrendData[];
}

export function ExpenseTrends({ data }: ExpenseTrendsProps) {
  // Get the most recent month's data
  const currentMonthData = data[data.length - 1];
  
  // Transform data for pie chart
  const pieData = Object.entries(CATEGORY_COLORS).map(([category]) => ({
    name: category,
    value: currentMonthData[category as Category] || 0
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="capitalize font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {((data.value / currentMonthData.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                name
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return percent > 0.05 ? (
                  <text
                    x={x}
                    y={y}
                    fill="currentColor"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs capitalize"
                  >
                    {name} ({(percent * 100).toFixed(0)}%)
                  </text>
                ) : null;
              }}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name as Category]}
                  className="stroke-white dark:stroke-gray-800"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="capitalize">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}