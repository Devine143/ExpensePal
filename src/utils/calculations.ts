import { Expense, Category } from '../types/expense';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function calculateMonthlyExpenses(expenses: Expense[]): number {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    })
    .reduce((total, expense) => total + expense.amount, 0);
}

export function calculateCategoryTotals(expenses: Expense[]): Record<Category, number> {
  const categories: Record<Category, number> = {
    food: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    shopping: 0,
    health: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    categories[expense.category] += expense.amount;
  });

  return categories;
}

export function getTopCategories(expenses: Expense[]): Array<{ category: Category; amount: number }> {
  const categoryTotals = calculateCategoryTotals(expenses);
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);
}