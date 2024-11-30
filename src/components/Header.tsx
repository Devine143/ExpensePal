import React from 'react';
import { ThemeToggle } from './ui/ThemeToggle';
import { BarChart3 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            ExpenseTracker
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}