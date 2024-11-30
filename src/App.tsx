import React from 'react';
import { Header } from './components/Header';
import { ExpenseProvider } from './context/ExpenseContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExpenseForm } from './components/expenses/ExpenseForm';
import { ExpenseList } from './components/expenses/ExpenseList';

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Dashboard />
            <ExpenseForm />
            <ExpenseList />
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
}

export default App;