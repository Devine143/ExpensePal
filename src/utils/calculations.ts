import { Expense, Category } from '../types/expense';
import { startOfMonth, endOfMonth, isWithinInterval, eachMonthOfInterval, format, subMonths, isSameMonth } from 'date-fns';

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

export function getMonthlyTrends(expenses: Expense[]) {
  const end = new Date();
  const start = subMonths(end, 5); // Last 6 months
  const months = eachMonthOfInterval({ start, end });

  return months.map(month => {
    const monthlyExpenses = expenses.filter(expense => 
      isSameMonth(new Date(expense.date), month)
    );

    const categoryTotals = calculateCategoryTotals(monthlyExpenses);
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      total,
      ...categoryTotals
    };
  });
}

export function calculateMonthOverMonthGrowth(expenses: Expense[]): number {
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const currentMonthExpenses = expenses.filter(expense => 
    isSameMonth(new Date(expense.date), currentMonth)
  ).reduce((sum, expense) => sum + expense.amount, 0);

  const lastMonthExpenses = expenses.filter(expense => 
    isSameMonth(new Date(expense.date), lastMonth)
  ).reduce((sum, expense) => sum + expense.amount, 0);

  if (lastMonthExpenses === 0) return 0;
  return ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
}