# Zorvyn — Finance Dashboard

A clean, professional finance dashboard built with React + Vite for tracking income, expenses, and financial insights.

---

## 🚀 Setup

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx       # Sidebar + topbar shell
│   ├── StatCard.jsx     # Summary metric cards
│   ├── TransactionRow.jsx  # Editable transaction item
│   └── AddTransactionModal.jsx  # Add transaction form
├── context/
│   └── AppContext.jsx   # Global state (useReducer + Context)
├── data/
│   └── mockData.js      # Static mock transactions, categories, budgets
├── pages/
│   ├── Dashboard.jsx    # Main overview
│   ├── Transactions.jsx # Full transaction list with filters
│   ├── Income.jsx       # Income breakdown + charts
│   ├── Expenses.jsx     # Expense breakdown + budget tracker
│   └── Insights.jsx     # Smart analytics + observations
├── App.jsx              # Route definitions
├── main.jsx             # Entry point
└── index.css            # Global design tokens + utility classes
```

---

## ✨ Features

### 1. Dashboard Overview
- Summary cards: Total Balance, Income, Expenses
- Area chart: 6-month cash flow (income vs expenses)
- Donut chart: Spending breakdown by category
- Recent transactions list

### 2. Transactions Page
- Full transaction list with category icons
- Search by description or category name
- Filter by type: All / Income / Expense
- Filter by specific category, sort by date or amount
- CSV export of filtered results
- Admin: inline edit + delete transactions

### 3. Income Page
- Monthly income bar chart (color-coded by month)
- Breakdown by income source (Salary, Freelance, Investments, Rental)
- Progress bars showing % contribution of each source
- Full income transaction list with key stats

### 4. Expenses Page
- Monthly expenses bar chart
- Category breakdown with percentage share
- **Budget Tracker**: visual progress bars per category, highlights over-budget items
- Full expense transaction list

### 5. Insights Page
- Savings rate calculation
- Income & expense trend (last 3 months vs previous 3)
- Monthly comparison line chart (income, expenses, net savings)
- Horizontal bar chart: top spending categories
- Smart observations panel: auto-generated, actionable tips
- Best/Worst savings month cards

### 6. Role-Based UI
Switch between **Admin** and **Viewer** roles via the sidebar or topbar:

| Feature | Viewer | Admin |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export CSV | ✅ | ✅ |

### 7. Dark Mode
Toggle via the moon/sun icon in the sidebar or topbar. Preference persists across sessions.

### 8. Data Persistence
Transactions, role, and dark mode preference are saved to `localStorage` and restored on reload.

---

## 🎨 Design Decisions

- **Color palette**: Warm slate neutrals with amber (`#C8813A`) as the primary accent — deliberately avoiding generic AI blues/purples
- **Typography**: DM Sans (sans-serif) + DM Mono (monospace for numbers) — clean, editorial feel
- **Charts**: Recharts — lightweight, composable, SSR-compatible
- **CSS Modules**: Scoped styles per component, no global class conflicts
- **Design tokens**: All colors, shadows, radii defined as CSS custom properties on `:root` — enables clean dark mode switching

---

## 🧠 State Management

Uses React's built-in `useReducer` + `Context API`:
- Single `AppContext` with a reducer handling all mutations
- `useFilteredTransactions` hook applies search/filter/sort logic derived from context
- No external state library needed at this scale — keeps the bundle lean

---

## 📦 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool |
| React Router 6 | Client-side routing |
| Recharts | Data visualization |
| Lucide React | Icon set |
| CSS Modules | Scoped component styles |

---

## 🧪 Assumptions

- All data is mock/static (no backend or API calls)
- Amounts are in Indian Rupees (₹)
- Role switching is frontend-only — no auth system
- Budget goals are static mock data (can be made editable)

---

*Built for the Zorvyn Screening Portal frontend assignment — April 2026*
