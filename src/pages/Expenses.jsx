import { useApp } from "../context/AppContext";
import { CATEGORIES, MONTHLY_DATA, BUDGET_GOALS } from "../data/mockData";
import TransactionRow from "../components/TransactionRow";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import styles from "../stylesheets/pages/Expenses.module.css";

const EXPENSE_COLORS = [
  "#E76F51",
  "#F4A261",
  "#E9C46A",
  "#457B9D",
  "#6D6875",
  "#B5838D",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
      <p
        style={{
          color: "#E76F51",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
        }}
      >
        ₹{payload[0]?.value?.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function Expenses() {
  const { state } = useApp();

  const expenseTransactions = state.transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalExpenses = expenseTransactions.reduce((s, t) => s + t.amount, 0);

  // By category breakdown
  const byCategory = Object.entries(CATEGORIES)
    .filter(
      ([key]) =>
        !["salary", "freelance", "investments", "rental"].includes(key),
    )
    .map(([key, cat]) => ({
      key,
      name: cat.label,
      icon: cat.icon,
      color: cat.color,
      value: expenseTransactions
        .filter((t) => t.category === key)
        .reduce((s, t) => s + t.amount, 0),
      count: expenseTransactions.filter((t) => t.category === key).length,
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const monthlyExpenses = MONTHLY_DATA.map((m) => ({
    month: m.month,
    expenses: m.expenses,
  }));

  // Budget comparison
  const budgetData = BUDGET_GOALS.map((bg) => ({
    ...bg,
    catLabel: CATEGORIES[bg.category]?.label || bg.category,
    catIcon: CATEGORIES[bg.category]?.icon || "💳",
    pct: Math.round((bg.spent / bg.budget) * 100),
    over: bg.spent > bg.budget,
  }));

  const overBudget = budgetData.filter((b) => b.over).length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Expenses</h2>
          <p className={styles.sub}>Track spending and manage budgets</p>
        </div>
        <div className={styles.totalBadge}>
          <TrendingDown size={16} />
          <span>Total Spent: ₹{totalExpenses.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Stat row */}
      <div className={styles.statsRow}>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statLabel}>Total Expenses</span>
          <span className={styles.statValue}>
            ₹{totalExpenses.toLocaleString("en-IN")}
          </span>
          <span className={styles.statMeta}>
            {expenseTransactions.length} transactions
          </span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statLabel}>Highest Category</span>
          <span className={styles.statValue}>{byCategory[0]?.name || "—"}</span>
          <span className={styles.statMeta}>
            ₹{byCategory[0]?.value.toLocaleString("en-IN") || "0"} spent
          </span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statLabel}>Avg per Month</span>
          <span className={styles.statValue}>
            ₹
            {Math.round(
              monthlyExpenses.reduce((s, m) => s + m.expenses, 0) /
                monthlyExpenses.length,
            ).toLocaleString("en-IN")}
          </span>
          <span className={styles.statMeta}>last 6 months</span>
        </div>
        <div
          className={`card ${styles.statCard} ${overBudget > 0 ? styles.statWarn : styles.statOk}`}
        >
          <span className={styles.statLabel}>Budget Alerts</span>
          <span className={styles.statValue}>{overBudget}</span>
          <span className={styles.statMeta}>
            {overBudget > 0 ? "categories over budget" : "All within budget"}
          </span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Monthly Expenses Chart */}
        <div className={`card ${styles.chartCard}`}>
          <div style={{ marginBottom: 18 }}>
            <h3 className={styles.chartTitle}>Monthly Expenses</h3>
            <p className={styles.chartSub}>6-month trend</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyExpenses}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barSize={32}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--bg-subtle)" }}
              />
              <Bar dataKey="expenses" name="Expenses" radius={[5, 5, 0, 0]}>
                {monthlyExpenses.map((_, i) => (
                  <Cell
                    key={i}
                    fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className={`card ${styles.catCard}`}>
          <h3 className={styles.chartTitle} style={{ marginBottom: 16 }}>
            By Category
          </h3>
          {byCategory.slice(0, 6).map((cat, i) => {
            const pct =
              totalExpenses > 0
                ? Math.round((cat.value / totalExpenses) * 100)
                : 0;
            return (
              <div key={cat.key} className={styles.catRow}>
                <div
                  className={styles.catIcon}
                  style={{ background: cat.color + "18", color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className={styles.catInfo}>
                  <div className={styles.catTop}>
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catAmt}>
                      ₹{cat.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${pct}%`, background: cat.color }}
                    />
                  </div>
                  <span className={styles.catPct}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget tracker */}
      <div className={`card ${styles.budgetCard}`}>
        <div className={styles.budgetHeader}>
          <h3 className={styles.chartTitle}>Budget Tracker</h3>
          <p className={styles.chartSub}>Spending vs allocated budget</p>
        </div>
        <div className={styles.budgetGrid}>
          {budgetData.map((b) => (
            <div
              key={b.category}
              className={`${styles.budgetItem} ${b.over ? styles.budgetOver : styles.budgetOk}`}
            >
              <div className={styles.budgetTop}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={styles.budgetIcon}>
                    {CATEGORIES[b.category]?.icon}
                  </span>
                  <span className={styles.budgetCat}>{b.catLabel}</span>
                </div>
                {b.over ? (
                  <AlertTriangle
                    size={14}
                    style={{ color: "var(--expense-color)" }}
                  />
                ) : (
                  <CheckCircle
                    size={14}
                    style={{ color: "var(--income-color)" }}
                  />
                )}
              </div>
              <div className={styles.budgetBar}>
                <div
                  className={styles.budgetFill}
                  style={{
                    width: `${Math.min(b.pct, 100)}%`,
                    background: b.over
                      ? "var(--expense-color)"
                      : "var(--income-color)",
                  }}
                />
              </div>
              <div className={styles.budgetMeta}>
                <span>
                  ₹{b.spent.toLocaleString("en-IN")} / ₹
                  {b.budget.toLocaleString("en-IN")}
                </span>
                <span className={b.over ? styles.overText : styles.okText}>
                  {b.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className={`card ${styles.txCard}`}>
        <div className={styles.txHeader}>
          <h3 className={styles.chartTitle}>All Expense Transactions</h3>
          <span className={styles.count}>
            {expenseTransactions.length} records
          </span>
        </div>
        <div className={styles.txList}>
          {expenseTransactions.length === 0 ? (
            <div className={styles.empty}>No expense transactions found.</div>
          ) : (
            expenseTransactions.map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
