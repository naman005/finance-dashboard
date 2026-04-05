import styles from "../../stylesheets/pages/Dashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { formatAmount } from "../../utils/helpers";

const SPEND_COLORS = [
  "#2D6A4F",
  "#E76F51",
  "#457B9D",
  "#E9C46A",
  "#6D6875",
  "#84A98C",
];

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

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
        {payload[0].name}
      </p>
      <p
        style={{
          color: payload[0].payload.fill,
          fontFamily: "var(--font-mono)",
        }}
      >
        {formatAmount(payload[0].value)}
      </p>
    </div>
  );
};

export default function SpendingPie() {
  const { state } = useApp();
  const categoryData = getCategoryBreakdown(state.transactions);
  const expenses = categoryData.reduce((s, t) => s + t.value, 0);

  return (
    <div className={`card ${styles.pieCard}`}>
      <div style={{ marginBottom: 8 }}>
        <h3 className={styles.chartTitle}>Spending Breakdown</h3>
        <p className={styles.chartSub}>By category</p>
      </div>
      <div className={styles.pieWrap}>
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
              startAngle={90}
              endAngle={-270}
            >
              {categoryData.map((_, i) => (
                <Cell
                  key={i}
                  fill={SPEND_COLORS[i % SPEND_COLORS.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.pieCentre}>
          <span className={styles.pieCentreVal}>{formatAmount(expenses)}</span>
          <span className={styles.pieCentreLbl}>total spent</span>
        </div>
      </div>
      <div className={styles.pieList}>
        {categoryData.map((item, i) => {
          const pct =
            expenses > 0 ? Math.round((item.value / expenses) * 100) : 0;
          return (
            <div key={i} className={styles.pieRow}>
              <div
                className={styles.pieDot}
                style={{ background: SPEND_COLORS[i % SPEND_COLORS.length] }}
              />
              <span className={styles.pieName}>{item.name}</span>
              <span className={styles.pieBar}>
                <span
                  className={styles.pieBarFill}
                  style={{
                    width: `${pct}%`,
                    background: SPEND_COLORS[i % SPEND_COLORS.length],
                  }}
                />
              </span>
              <span className={styles.pieVal}>{formatAmount(item.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
