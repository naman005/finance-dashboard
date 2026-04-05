import { useApp } from "../context/AppContext";
import { CATEGORIES, MONTHLY_DATA } from "../data/mockData";
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
import { TrendingUp } from "lucide-react";
import styles from "../stylesheets/pages/Income.module.css";

const INCOME_CATS = ["salary", "freelance", "investments", "rental"];
const BAR_COLORS = ["#2D6A4F", "#52796F", "#84A98C", "#40916C", "#95D5B2"];

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
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: "#2D6A4F",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
        }}
      >
        ₹{payload[0]?.value?.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function Income() {
  const { state } = useApp();

  const incomeTransactions = state.transactions
    .filter((t) => t.type === "income")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIncome = incomeTransactions.reduce((s, t) => s + t.amount, 0);

  const bySource = INCOME_CATS.map((cat) => ({
    name: CATEGORIES[cat]?.label || cat,
    icon: CATEGORIES[cat]?.icon || "💰",
    value: incomeTransactions
      .filter((t) => t.category === cat)
      .reduce((s, t) => s + t.amount, 0),
    color: CATEGORIES[cat]?.color || "#2D6A4F",
    count: incomeTransactions.filter((t) => t.category === cat).length,
  }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const monthlyIncome = MONTHLY_DATA.map((m) => ({
    month: m.month,
    income: m.income,
  }));

  const avgMonthly = Math.round(
    monthlyIncome.reduce((s, m) => s + m.income, 0) / monthlyIncome.length,
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Income</h2>
          <p className={styles.sub}>All income sources and trends</p>
        </div>
        <div className={styles.totalBadge}>
          <TrendingUp size={16} />
          <span>Total: ₹{totalIncome.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={`card ${styles.summaryCard}`}>
          <span className={styles.summaryLabel}>Total Income</span>
          <span className={styles.summaryValue}>
            ₹{totalIncome.toLocaleString("en-IN")}
          </span>
          <span className={styles.summaryMeta}>
            {incomeTransactions.length} transactions
          </span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={styles.summaryLabel}>Monthly Average</span>
          <span className={styles.summaryValue}>
            ₹{avgMonthly.toLocaleString("en-IN")}
          </span>
          <span className={styles.summaryMeta}>last 6 months</span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={styles.summaryLabel}>Highest Month</span>
          <span className={styles.summaryValue}>
            ₹
            {Math.max(...monthlyIncome.map((m) => m.income)).toLocaleString(
              "en-IN",
            )}
          </span>
          <span className={styles.summaryMeta}>
            {
              monthlyIncome.find(
                (m) =>
                  m.income === Math.max(...monthlyIncome.map((m) => m.income)),
              )?.month
            }
          </span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={styles.summaryLabel}>Income Sources</span>
          <span className={styles.summaryValue}>{bySource.length}</span>
          <span className={styles.summaryMeta}>active streams</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Monthly Income</h3>
              <p className={styles.chartSub}>Last 6 months breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyIncome}
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
              <Bar dataKey="income" name="Income" radius={[5, 5, 0, 0]}>
                {monthlyIncome.map((entry, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`card ${styles.sourceCard}`}>
          <h3 className={styles.chartTitle} style={{ marginBottom: 16 }}>
            By Source
          </h3>
          {bySource.map((src, i) => {
            const pct = Math.round((src.value / totalIncome) * 100);
            return (
              <div key={src.name} className={styles.sourceRow}>
                <div
                  className={styles.sourceIcon}
                  style={{ background: src.color + "18", color: src.color }}
                >
                  {src.icon}
                </div>
                <div className={styles.sourceInfo}>
                  <div className={styles.sourceTop}>
                    <span className={styles.sourceName}>{src.name}</span>
                    <span className={styles.sourceAmt}>
                      ₹{src.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${pct}%`, background: src.color }}
                    />
                  </div>
                  <span className={styles.sourcePct}>
                    {pct}% of total · {src.count} transactions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`card ${styles.txCard}`}>
        <div className={styles.txHeader}>
          <h3 className={styles.chartTitle}>All Income Transactions</h3>
          <span className={styles.count}>
            {incomeTransactions.length} records
          </span>
        </div>
        <div className={styles.txList}>
          {incomeTransactions.length === 0 ? (
            <div className={styles.empty}>
              No income transactions recorded yet.
            </div>
          ) : (
            incomeTransactions.map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
