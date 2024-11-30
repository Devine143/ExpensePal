import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export function BudgetInput() {
  const { state, dispatch } = useExpense();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(state.budget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      dispatch({ type: 'SET_BUDGET', payload: newBudget });
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter monthly budget"
            min="0"
            step="0.01"
            required
          />
        </div>
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</p>
        <p className="text-2xl font-bold">{formatCurrency(state.budget)}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
        Edit Budget
      </Button>
    </div>
  );
}