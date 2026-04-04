import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, MONTHLY_DATA } from "../data/mockData";
import StatCard from "../components/StatCard";
import TransactionRow from "../components/TransactionRow";
import AddTransactionModal from "../components/AddTransactionModal";
import {
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../stylesheets/pages/Dashboard.module.css";

const SPEND_COLORS = [
  "#C8813A",
  "#2D6A4F",
  "#E76F51",
  "#457B9D",
  "#6D6875",
  "#E9C46A",
];

function calcStats(transactions) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  return { income, expenses, balance };
}

function getCategoryBreakdown(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([key, value]) => ({ name: CATEGORIES[key]?.label || key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

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
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          style={{
            color: p.color,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
          }}
        >
          {p.name}: ₹{p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "var(--shadow-md)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>
        {payload[0].name}
      </p>
      <p
        style={{
          color: payload[0].payload.fill,
          fontFamily: "var(--font-mono)",
        }}
      >
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { state } = useApp();
  const [showModal, setShowModal] = useState(false);

  const { income, expenses, balance } = calcStats(state.transactions);
  const categoryData = getCategoryBreakdown(state.transactions);
  const recent = state.transactions.slice(0, 6);

  // Month-over-month change
  const thisMonth = state.transactions.filter(
    (t) => new Date(t.date).getMonth() === new Date().getMonth(),
  );
  const lastMonthTransactions = state.transactions.filter(
    (t) => new Date(t.date).getMonth() === new Date().getMonth() - 1,
  );
  const thisIncome = thisMonth
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const lastIncome = lastMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const incomeChange =
    lastIncome > 0
      ? Math.round(((thisIncome - lastIncome) / lastIncome) * 100)
      : 0;

  const thisExp = thisMonth
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const lastExp = lastMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const expChange =
    lastExp > 0 ? Math.round(((thisExp - lastExp) / lastExp) * 100) : 0;

  return (
    <div className={styles.page}>
      {/* Header row */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.greeting}>Welcome Back, Naman!</h2>
          <p className={styles.subtext}>
            Here's your financial summary for March 2026
          </p>
        </div>
        {state.role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Balance"
          value={balance}
          variant="balance"
          icon={<Wallet size={15} />}
        />
        <StatCard
          label="Total Income"
          value={income}
          change={incomeChange}
          variant="income"
          icon={<TrendingUp size={15} />}
        />
        <StatCard
          label="Total Expenses"
          value={expenses}
          change={expChange}
          variant="expense"
          icon={<TrendingDown size={15} />}
        />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Monthly Area Chart */}
        <div className={`card ${styles.chartCard} ${styles.wide}`}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Cash Flow</h3>
              <p className={styles.chartSub}>
                Income vs Expenses — last 6 months
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={MONTHLY_DATA}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C0392B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C0392B" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#2D6A4F"
                strokeWidth={2}
                fill="url(#incGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#2D6A4F" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#C0392B"
                strokeWidth={2}
                fill="url(#expGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#C0392B" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span
                    style={{ fontSize: 11, color: "var(--text-secondary)" }}
                  >
                    {v}
                  </span>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category Pie */}
        <div className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Spending Breakdown</h3>
              <p className={styles.chartSub}>By category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={SPEND_COLORS[i % SPEND_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legendList}>
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <div
                  className={styles.legendDot}
                  style={{ background: SPEND_COLORS[i] }}
                />
                <span className={styles.legendLabel}>{item.name}</span>
                <span className={styles.legendValue}>
                  ₹{item.value.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`card ${styles.transactionsCard}`}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.chartTitle}>Recent Transactions</h3>
            <p className={styles.chartSub}>
              {state.transactions.length} total transactions
            </p>
          </div>
          <Link to="/transactions" className="btn btn-ghost">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.txList}>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              No transactions yet. Add one to get started.
            </div>
          ) : (
            recent.map((t) => (
              <TransactionRow key={t.id} transaction={t} compact />
            ))
          )}
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
