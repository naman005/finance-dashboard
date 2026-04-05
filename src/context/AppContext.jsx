import { createContext, useContext, useReducer, useEffect } from 'react';
import { USER, TRANSACTIONS, MONTHLY_DATA, BUDGET_GOALS } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  name: USER.name,
  role: 'admin', // 'admin' | 'viewer'
  transactions: TRANSACTIONS,
  monthlyData: MONTHLY_DATA,
  budgetGoals: BUDGET_GOALS,
  filters: {
    search: '',
    type: 'all', // 'all' | 'income' | 'expense'
    category: 'all',
    sortBy: 'date', // 'date' | 'amount'
    sortDir: 'desc',
  },
  darkMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('Zorvyn_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    try {
      const { transactions, darkMode, role } = state;
      localStorage.setItem('Zorvyn_state', JSON.stringify({ transactions, darkMode, role }));
    } catch {}
  }, [state.transactions, state.darkMode, state.role]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useFilteredTransactions() {
  const { state } = useApp();
  const { transactions, filters } = state;

  return transactions
    .filter(t => {
      const matchSearch =
        !filters.search ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === 'all' || t.type === filters.type;
      const matchCat = filters.category === 'all' || t.category === filters.category;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'amount') {
        return filters.sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return filters.sortDir === 'desc'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
}
