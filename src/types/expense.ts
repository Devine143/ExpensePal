export type Category =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  amount: number;
  month: string;
  categories: Partial<Record<Category, number>>;
}

export interface BudgetAlert {
  category: Category | 'total';
  threshold: number;
  currentSpending: number;
  percentage: number;
}