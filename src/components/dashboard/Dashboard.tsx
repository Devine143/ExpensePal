import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { StatCard } from './StatCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { BudgetInput } from './BudgetInput';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';
import {
  calculateTotalExpenses,
  calculateMonthlyExpenses,
  getTopCategories,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatCurrency';

export function Dashboard() {
  const { state } = useExpense();
  const { expenses, budget } = state;

  const totalExpenses = calculateTotalExpenses(expenses);
  const monthlyExpenses = calculateMonthlyExpenses(expenses);
  const topCategories = getTopCategories(expenses);
  const remainingBudget = budget - monthlyExpenses;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <BudgetInput />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon={Calendar}
        />
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(budget)}
          icon={TrendingUp}
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          icon={PieChart}
          trend={{
            value: budget ? (remainingBudget / budget) * 100 : 0,
            isPositive: remainingBudget > 0,
          }}
        />
      </div>

      {expenses.length > 0 && (
        <CategoryBreakdown
          categories={topCategories}
          total={totalExpenses}
        />
      )}
    </div>
  );
}