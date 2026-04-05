import { useApp } from "../context/AppContext";
import { CATEGORIES, MONTHLY_DATA } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import styles from "../stylesheets/pages/Insights.module.css";

const COLORS = [
  "#C8813A",
  "#2D6A4F",
  "#E76F51",
  "#457B9D",
  "#6D6875",
  "#E9C46A",
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
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

function getSavingsRate(income, expenses) {
  if (!income) return 0;
  return Math.round(((income - expenses) / income) * 100);
}

function BestWorstMonth({ bestMonth, worstMonth }) {
  return (
    <div className={styles.monthRow}>
      <div className={`card ${styles.monthCard} ${styles.monthBest}`}>
        <span className={styles.monthBadge}>Best Month</span>
        <div className={styles.monthName}>{bestMonth?.month}</div>
        <div className={styles.monthStat}>
          <span>Saved</span>
          <span
            className={styles.monthValue}
            style={{ color: "var(--income-color)" }}
          >
            ₹
            {(
              (bestMonth?.income || 0) - (bestMonth?.expenses || 0)
            ).toLocaleString("en-IN")}
          </span>
        </div>
        <div className={styles.monthStat}>
          <span>Income</span>
          <span>₹{bestMonth?.income.toLocaleString("en-IN")}</span>
        </div>
        <div className={styles.monthStat}>
          <span>Expenses</span>
          <span>₹{bestMonth?.expenses.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <div className={`card ${styles.monthCard} ${styles.monthWorst}`}>
        <span className={styles.monthBadge}>Lowest Savings</span>
        <div className={styles.monthName}>{worstMonth?.month}</div>
        <div className={styles.monthStat}>
          <span>Saved</span>
          <span
            className={styles.monthValue}
            style={{ color: "var(--expense-color)" }}
          >
            ₹
            {(
              (worstMonth?.income || 0) - (worstMonth?.expenses || 0)
            ).toLocaleString("en-IN")}
          </span>
        </div>
        <div className={styles.monthStat}>
          <span>Income</span>
          <span>₹{worstMonth?.income.toLocaleString("en-IN")}</span>
        </div>
        <div className={styles.monthStat}>
          <span>Expenses</span>
          <span>₹{worstMonth?.expenses.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

function Observation({ observations }) {
  return (
    <div className={`card ${styles.observationsCard}`}>
      <h3 className={styles.chartTitle} style={{ marginBottom: 16 }}>
        <Lightbulb
          size={16}
          style={{
            display: "inline",
            marginRight: 8,
            color: "var(--accent-primary)",
          }}
        />
        Smart Observations
      </h3>
      <div className={styles.obsList}>
        {observations.map((obs, i) => (
          <div key={i} className={`${styles.obsItem} ${styles[obs.type]}`}>
            {obs.type === "positive" && (
              <CheckCircle2 size={15} className={styles.obsIcon} />
            )}
            {obs.type === "warning" && (
              <AlertCircle size={15} className={styles.obsIcon} />
            )}
            {obs.type === "neutral" && (
              <Target size={15} className={styles.obsIcon} />
            )}
            {obs.type === "tip" && (
              <Lightbulb size={15} className={styles.obsIcon} />
            )}
            <p className={styles.obsText}>{obs.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpendingBar({ catBarData }) {
  return (
    <div className={`card ${styles.chartCard}`}>
      <div style={{ marginBottom: 18 }}>
        <h3 className={styles.chartTitle}>Spending by Category</h3>
        <p className={styles.chartSub}>Top spending categories</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={catBarData}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          barSize={16}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--bg-subtle)" }}
          />
          <Bar dataKey="value" name="Spent" radius={[0, 5, 5, 0]}>
            {catBarData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MonthlyComparison({ monthComparison }) {
  return (
    <div className={`card ${styles.chartCard}`}>
      <div style={{ marginBottom: 18 }}>
        <h3 className={styles.chartTitle}>Monthly Comparison</h3>
        <p className={styles.chartSub}>Income, expenses, and net savings</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={monthComparison}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => (
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {v}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#2D6A4F"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Expenses"
            stroke="#E76F51"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Savings"
            stroke="#C8813A"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function KeyMetrics({
  savingsRate,
  incTrend,
  expTrend,
  topCatName,
  topCatAmt,
}) {
  const incomeClass = incTrend < 0 ? styles.negative : styles.positive;
  const expenseClass = expTrend > 0 ? styles.negative : styles.positive;

  return (
    <div className={styles.metricsRow}>
      <div className={`card ${styles.metricCard} ${styles.highlight}`}>
        <div className={styles.metricIcon}>
          <Target size={18} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Savings Rate</span>
          <span className={styles.metricValue}>{savingsRate}%</span>
          <span className={styles.metricSub}>
            {savingsRate >= 20 ? "✓ On track" : "↓ Below target"}
          </span>
        </div>
      </div>
      <div className={`card ${styles.metricCard}`}>
        <div className={`${styles.metricIcon} ${incomeClass}`}>
          <TrendingUp size={18} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Income Trend</span>
          <span className={`${styles.metricValue} ${incomeClass}`}>
            {incTrend > 0 ? "+" : ""}
            {incTrend}%
          </span>
          <span className={styles.metricSub}>vs previous quarter</span>
        </div>
      </div>
      <div className={`card ${styles.metricCard}`}>
        <div className={`${styles.metricIcon} ${expenseClass}`}>
          <TrendingDown size={18} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Expense Trend</span>
          <span className={`${styles.metricValue} ${expenseClass}`}>
            {expTrend >= 0 ? "+" : ""}
            {expTrend}%
          </span>
          <span className={styles.metricSub}>vs previous quarter</span>
        </div>
      </div>
      <div className={`card ${styles.metricCard}`}>
        <div
          className={styles.metricIcon}
          style={{ color: "var(--accent-primary)" }}
        >
          <Lightbulb size={18} />
        </div>
        <div className={styles.metricInfo}>
          <span className={styles.metricLabel}>Top Expense</span>
          <span className={styles.metricValue} style={{ fontSize: 16 }}>
            {topCatName}
          </span>
          <span className={styles.metricSub}>
            ₹{topCatAmt.toLocaleString("en-IN")} total
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate = getSavingsRate(income, expenses);

  const catMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
  const topCatName = topCat ? CATEGORIES[topCat[0]]?.label : "—";
  const topCatAmt = topCat ? topCat[1] : 0;

  const monthComparison = MONTHLY_DATA.map((m) => ({
    month: m.month,
    Income: m.income,
    Expenses: m.expenses,
    Savings: m.income - m.expenses,
  }));

  const bestMonth = [...MONTHLY_DATA].sort(
    (a, b) => b.income - b.expenses - (a.income - a.expenses),
  )[0];
  const worstMonth = [...MONTHLY_DATA].sort(
    (a, b) => a.income - a.expenses - (b.income - b.expenses),
  )[0];

  const last3Exp = MONTHLY_DATA.slice(-3).reduce((s, m) => s + m.expenses, 0);
  const prev3Exp = MONTHLY_DATA.slice(0, 3).reduce((s, m) => s + m.expenses, 0);
  const expTrend =
    prev3Exp > 0 ? Math.round(((last3Exp - prev3Exp) / prev3Exp) * 100) : 0;

  // Income trend
  const last3Inc = MONTHLY_DATA.slice(-3).reduce((s, m) => s + m.income, 0);
  const prev3Inc = MONTHLY_DATA.slice(0, 3).reduce((s, m) => s + m.income, 0);
  const incTrend =
    prev3Inc > 0 ? Math.round(((last3Inc - prev3Inc) / prev3Inc) * 100) : 0;

  const catBarData = Object.entries(catMap)
    .map(([key, val]) => ({ name: CATEGORIES[key]?.label || key, value: val }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const observations = [];
  if (savingsRate >= 30)
    observations.push({
      type: "positive",
      text: `Excellent savings rate of ${savingsRate}%. You're saving more than recommended.`,
    });
  else if (savingsRate >= 15)
    observations.push({
      type: "neutral",
      text: `Good savings rate of ${savingsRate}%. Aim for 30% or higher.`,
    });
  else
    observations.push({
      type: "warning",
      text: `Low savings rate of ${savingsRate}%. Financial advisors recommend at least 20%.`,
    });

  if (expTrend > 0)
    observations.push({
      type: "warning",
      text: `Expenses grew ${expTrend}% in the last 3 months. Review discretionary spending.`,
    });
  else
    observations.push({
      type: "positive",
      text: `Expenses reduced by ${Math.abs(expTrend)}% in the last 3 months. Great discipline!`,
    });

  if (incTrend > 0)
    observations.push({
      type: "positive",
      text: `Income grew ${incTrend}% over the last 3 months. Strong momentum.`,
    });

  if (topCatAmt > income * 0.3)
    observations.push({
      type: "warning",
      text: `${topCatName} consumes over 30% of income. Consider setting a budget limit.`,
    });
  else
    observations.push({
      type: "positive",
      text: `No single expense category is dominating your budget. Healthy spending distribution.`,
    });

  observations.push({
    type: "tip",
    text: `Your best savings month was ${bestMonth?.month} with ₹${(bestMonth?.income - bestMonth?.expenses).toLocaleString("en-IN")} saved. Use it as a benchmark.`,
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Insights</h2>
          <p className={styles.sub}>
            Smart analysis of your financial patterns
          </p>
        </div>
      </div>

      <KeyMetrics
        savingsRate={savingsRate}
        incTrend={incTrend}
        expTrend={expTrend}
        topCatName={topCatName}
        topCatAmt={topCatAmt}
      />

      <div className={styles.chartsRow}>
        <MonthlyComparison monthComparison={monthComparison} />
        <SpendingBar catBarData={catBarData} />
      </div>

      <Observation observations={observations} />
      <BestWorstMonth bestMonth={bestMonth} worstMonth={worstMonth} />
    </div>
  );
}
