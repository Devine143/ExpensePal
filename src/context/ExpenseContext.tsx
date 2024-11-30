import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Expense, Category, Budget, BudgetAlert } from '../types/expense';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateMonthlyExpenses, calculateCategoryTotals } from '../utils/calculations';

interface ExpenseState {
  expenses: Expense[];
  budgets: Budget[];
  currentBudget: Budget;
  alerts: BudgetAlert[];
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_BUDGET'; payload: Budget }
  | { type: 'UPDATE_ALERTS'; payload: BudgetAlert[] }
  | { type: 'LOAD_STATE'; payload: ExpenseState };

const initialBudget: Budget = {
  amount: 0,
  month: new Date().toISOString().slice(0, 7),
  categories: {},
};

const initialState: ExpenseState = {
  expenses: [],
  budgets: [],
  currentBudget: initialBudget,
  alerts: [],
};

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'SET_BUDGET':
      return {
        ...state,
        currentBudget: action.payload,
        budgets: [
          ...state.budgets.filter((b) => b.month !== action.payload.month),
          action.payload,
        ],
      };
    case 'UPDATE_ALERTS':
      return {
        ...state,
        alerts: action.payload,
      };
    case 'LOAD_STATE':
      return {
        ...action.payload,
        currentBudget: action.payload.currentBudget || initialBudget,
        alerts: action.payload.alerts || [],
        expenses: action.payload.expenses || [],
        budgets: action.payload.budgets || [],
      };
    default:
      return state;
  }
}

const ExpenseContext = createContext<
  | {
      state: ExpenseState;
      dispatch: React.Dispatch<ExpenseAction>;
    }
  | undefined
>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [savedState, setSavedState] = useLocalStorage<ExpenseState>(
    'expense-tracker-state',
    initialState
  );

  const [state, dispatch] = useReducer(expenseReducer, {
    ...savedState,
    currentBudget: savedState.currentBudget || initialBudget,
    alerts: savedState.alerts || [],
    expenses: savedState.expenses || [],
    budgets: savedState.budgets || [],
  });

  // Check budget alerts whenever expenses change
  useEffect(() => {
    if (!state.currentBudget) return;

    const monthlyExpenses = calculateMonthlyExpenses(state.expenses || []);
    const categoryTotals = calculateCategoryTotals(state.expenses || []);
    const alerts: BudgetAlert[] = [];

    // Check total budget
    if (state.currentBudget.amount > 0) {
      const totalPercentage = (monthlyExpenses / state.currentBudget.amount) * 100;
      if (totalPercentage >= 80) {
        alerts.push({
          category: 'total',
          threshold: state.currentBudget.amount,
          currentSpending: monthlyExpenses,
          percentage: totalPercentage,
        });
      }
    }

    // Check category budgets
    Object.entries(state.currentBudget.categories || {}).forEach(([category, budget]) => {
      if (budget) {
        const spending = categoryTotals[category as Category] || 0;
        const percentage = (spending / budget) * 100;
        if (percentage >= 80) {
          alerts.push({
            category: category as Category,
            threshold: budget,
            currentSpending: spending,
            percentage,
          });
        }
      }
    });

    dispatch({ type: 'UPDATE_ALERTS', payload: alerts });
  }, [state.expenses, state.currentBudget]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}