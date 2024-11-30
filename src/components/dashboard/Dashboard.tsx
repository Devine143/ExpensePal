import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { StatCard } from './StatCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { BudgetInput } from './BudgetInput';
import { CategoryBudgets } from './CategoryBudgets';
import { BudgetAlerts } from './BudgetAlerts';
import { ExpenseTrends } from './ExpenseTrends';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';
import {
  calculateTotalExpenses,
  calculateMonthlyExpenses,
  getTopCategories,
  getMonthlyTrends,
  calculateMonthOverMonthGrowth,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatCurrency';

export function Dashboard() {
  const { state } = useExpense();
  const { expenses = [], currentBudget } = state;

  // Ensure currentBudget has a default value
  const budget = currentBudget || {
    amount: 0,
    month: new Date().toISOString().slice(0, 7),
    categories: {},
  };

  const totalExpenses = calculateTotalExpenses(expenses);
  const monthlyExpenses = calculateMonthlyExpenses(expenses);
  const topCategories = getTopCategories(expenses);
  const remainingBudget = budget.amount - monthlyExpenses;
  const monthlyTrends = getMonthlyTrends(expenses);
  const monthOverMonthGrowth = calculateMonthOverMonthGrowth(expenses);

  return (
    <div className="space-y-6">
      <BudgetAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <BudgetInput />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <CategoryBudgets />
        </div>
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
          trend={{
            value: monthOverMonthGrowth,
            isPositive: monthOverMonthGrowth <= 0,
          }}
        />
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(budget.amount)}
          icon={TrendingUp}
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          icon={PieChart}
          trend={{
            value: budget.amount
              ? (remainingBudget / budget.amount) * 100
              : 0,
            isPositive: remainingBudget > 0,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expenses.length > 0 && (
          <CategoryBreakdown categories={topCategories} total={totalExpenses} />
        )}
        {expenses.length > 0 && <ExpenseTrends data={monthlyTrends} />}
      </div>
    </div>
  );
}