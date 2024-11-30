import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { format } from 'date-fns';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { ExpenseModal } from './ExpenseModal';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/formatCurrency';

export function ExpenseList() {
  const { state, dispatch } = useExpense();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleSave = (updatedExpense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    setEditingExpense(null);
  };

  if (state.expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-500 dark:text-gray-400">No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {state.expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{expense.description}</h3>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                <span className="capitalize">{expense.category}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(expense)}
                aria-label="Edit expense"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(expense.id)}
                aria-label="Delete expense"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ExpenseModal
        expense={editingExpense}
        isOpen={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        onSave={handleSave}
      />
    </>
  );
}