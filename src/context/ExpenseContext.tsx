import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Expense, Category } from '../types/expense';

interface ExpenseState {
  expenses: Expense[];
  budget: number;
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_BUDGET'; payload: number };

const initialState: ExpenseState = {
  expenses: [],
  budget: 0,
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
        budget: action.payload,
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
  const [state, dispatch] = useReducer(expenseReducer, initialState);

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