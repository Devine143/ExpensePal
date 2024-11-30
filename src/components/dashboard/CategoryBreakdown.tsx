import React from 'react';
import { Category } from '../../types/expense';
import { formatCurrency } from '../../utils/formatCurrency';

interface CategoryBreakdownProps {
  categories: Array<{ category: Category; amount: number }>;
  total: number;
}

export function CategoryBreakdown({ categories, total }: CategoryBreakdownProps) {
  const getPercentage = (amount: number) => ((amount / total) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
      <div className="space-y-4">
        {categories.map(({ category, amount }) => (
          <div key={category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize">{category}</span>
              <span>{formatCurrency(amount)} ({getPercentage(amount)}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                style={{ width: `${getPercentage(amount)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}