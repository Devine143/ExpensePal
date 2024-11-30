import React from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { AlertTriangle } from 'lucide-react';

export function BudgetAlerts() {
  const { state } = useExpense();
  const alerts = state.alerts || [];

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Budget Alert
              </h3>
              <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {alert.category === 'total' ? (
                  <p>
                    You've spent {formatCurrency(alert.currentSpending)} ({alert.percentage.toFixed(1)}%)
                    of your total monthly budget of {formatCurrency(alert.threshold)}
                  </p>
                ) : (
                  <p>
                    You've spent {formatCurrency(alert.currentSpending)} ({alert.percentage.toFixed(1)}%)
                    of your {alert.category} budget of {formatCurrency(alert.threshold)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}