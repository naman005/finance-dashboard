# Zorvyn - Finance Dashboard

A clean, interactive finance dashboard for tracking income, expenses, and spending patterns. Built with React + Vite as a frontend internship take home assignment submission.

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

**Requirements:** Node.js 18+

---

## Features

### Dashboard
- Summary cards with live sparklines (Total Balance, Income, Expenses)
- 6-month cash flow area chart (income vs expenses)
- Spending breakdown donut chart with category legend
- Recent transactions table with category badges
- **3 action buttons** in header: Role switcher, Dark/Light toggle, Fullscreen

### Transactions
- Searchable, filterable transaction list
- Filter by type (All / Income / Expense) and category
- Sort by date or amount (asc/desc)
- **CSV export** of filtered results
- Inline **edit** and **delete** (Admin only)

### Income & Expenses
- Monthly bar charts with per-bar color coding
- Breakdown by source/category with percentage progress bars
- Budget tracker with over-budget alerts (Expenses page)

### Insights
- Savings rate, income trend, expense trend vs prior quarter
- Monthly comparison line chart
- Auto-generated smart observations (5 dynamic tips)
- Best and lowest savings month breakdown

### Role-Based UI
| Feature | Viewer | Admin |
|---|:---:|:---:|
| View all data | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Switch roles via the **Admin / Viewer** button in the dashboard header or the sidebar toggle.

### Other
- **Dark mode** - persists across sessions via `localStorage`
- **Data persistence** - transactions and preferences saved locally
- **Custom categories** - Add modal lets you type a new category if none fit
- **404 page** - clean not-found page with back navigation
- **Fully responsive** - sidebar collapses to hamburger on mobile; table columns progressively hide

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Routing** | React Router 6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Styling** | CSS Modules + CSS custom properties |
| **State** | `useReducer` + Context API |
| **Storage** | `localStorage` for persistence |

---

## Project Structure

```
src/
├── components/          # Shared UI (StatCard, TransactionRow, Layout, Modal)
├── context/             # AppContext - global state + useFilteredTransactions hook
├── data/                # mockData.js - transactions, categories, monthly data
├── pages/               # Dashboard, Transactions, Income, Expenses, Insights, 404
└── stylesheets/         # CSS Modules (co-located by component/page)
└── utils/               # Helper functions for date and amount
```

---

## State Management

Single `AppContext` using `useReducer`. All mutations - add, edit, delete transactions, role switch, theme toggle - go through the reducer. `useFilteredTransactions` is a derived hook that applies search/filter/sort logic without extra re-renders. No external library needed at this scale.

---


*Submitted for Zorvyn Frontend Internship - April 2026*
