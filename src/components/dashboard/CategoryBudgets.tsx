import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Button } from '../ui/Button';
import { Category } from '../../types/expense';
import { formatCurrency } from '../../utils/formatCurrency';

export function CategoryBudgets() {
  const { state, dispatch } = useExpense();
  const [isEditing, setIsEditing] = useState(false);
  const [categoryBudgets, setCategoryBudgets] = useState(
    state.currentBudget?.categories || {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_BUDGET',
      payload: {
        ...state.currentBudget,
        categories: categoryBudgets,
      },
    });
    setIsEditing(false);
  };

  const handleCategoryBudgetChange = (category: Category, value: string) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: value === '' ? undefined : parseFloat(value),
    }));
  };

  const categories: Category[] = [
    'food',
    'transport',
    'utilities',
    'entertainment',
    'shopping',
    'health',
    'other',
  ];

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Category Budgets</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category}>
              <label
                htmlFor={`budget-${category}`}
                className="block text-sm font-medium capitalize mb-1"
              >
                {category}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R
                </span>
                <input
                  type="number"
                  id={`budget-${category}`}
                  value={categoryBudgets[category] || ''}
                  onChange={(e) =>
                    handleCategoryBudgetChange(category, e.target.value)
                  }
                  className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Enter budget"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="submit">Save Changes</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Category Budgets</h3>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
          Edit Budgets
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <span className="capitalize">{category}</span>
            <span className="font-medium">
              {state.currentBudget?.categories[category]
                ? formatCurrency(state.currentBudget.categories[category]!)
                : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}