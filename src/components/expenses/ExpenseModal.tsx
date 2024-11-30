import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Category, Expense } from '../../types/expense';

interface ExpenseModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export function ExpenseModal({ expense, isOpen, onClose, onSave }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'other' as Category,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        category: expense.category,
        date: expense.date,
      });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    const updatedExpense: Expense = {
      ...expense,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-amount" className="block text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              id="modal-amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="modal-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              id="modal-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="modal-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="modal-date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              id="modal-date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}