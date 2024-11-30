import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Button } from '../ui/Button';
import { Category } from '../../types/expense';

export function ExpenseForm() {
  const { dispatch } = useExpense();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'other' as Category,
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    setFormData({
      amount: '',
      description: '',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
          required
          min="0"
          step="0.01"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
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
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700"
          required
        />
      </div>
      
      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
}