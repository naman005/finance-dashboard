import styles from "../stylesheets/components/StatCard.module.css";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { MONTHLY_DATA } from "../data/mockData";

function formatAmount(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  variant = "default",
  icon,
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div>
        <div className={styles.value}>{formatAmount(value)}</div>
        <div className={styles.label}>{label}</div>
      </div>

      {change !== undefined && (
        <div
          className={`${styles.change} ${isPositive ? styles.positive : isNeutral ? styles.neutral : styles.negative}`}
        >
          <div>
            <div className={styles.changeValue}>{change}%</div>
            <div className={styles.changeLabel}>
              {changeLabel || "vs last month"}
            </div>
          </div>
          <ResponsiveContainer width="50%" height={50}>
            <AreaChart
              data={MONTHLY_DATA}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {label === "Total Income" ? (
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
              ) : (
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
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
