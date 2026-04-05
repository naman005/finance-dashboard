import styles from "../stylesheets/components/StatCard.module.css";
import { LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

function formatAmount(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000)   return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * StatCard — shared summary metric card.
 *
 * Props
 * ─────
 * label       {string}     Card heading, e.g. "Total Balance"
 * value       {number}     Main metric value in ₹
 * change      {number}     % change vs last period (optional)
 * changeLabel {string}     Text next to %, default "vs last month"
 * variant     {string}     "balance" | "income" | "expense" | "default"
 * icon        {ReactNode}  Small icon, shown top-right
 * sparkData   {number[]}   Raw number array → sparkline (optional)
 * sparkColor  {string}     Sparkline stroke color (optional)
 */
export default function StatCard({
  label,
  value,
  change,
  changeLabel = "vs last month",
  variant = "default",
  icon,
  sparkData,
  sparkColor,
}) {
  const hasChange = change !== undefined && change !== null;
  const isPositive = hasChange && change > 0;
  const isNegative = hasChange && change < 0;

  const chartData = sparkData ? sparkData.map((v, i) => ({ i, v })) : null;

  return (
    <div className={`${styles.card} ${styles[variant] || ""}`}>

      {/* Top: label + icon */}
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <div className={styles.iconWrap}>{icon}</div>}
      </div>

      {/* Main value */}
      <div className={styles.value}>{formatAmount(value)}</div>

      {/* Bottom: change badge + sparkline */}
      <div className={styles.bottom}>
        {hasChange && (
          <span className={`${styles.change} ${
            isPositive ? styles.positive :
            isNegative ? styles.negative :
            styles.neutral
          }`}>
            {isPositive && <ArrowUpRight   size={12} />}
            {isNegative && <ArrowDownRight size={12} />}
            {!isPositive && !isNegative && <Minus size={12} />}
            {Math.abs(change)}% {changeLabel}
          </span>
        )}

        {chartData && (
          <div className={styles.sparkWrap}>
            <LineChart
              width={100} height={38}
              data={chartData}
              margin={{ top:4, right:0, left:0, bottom:0 }}
            >
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor || "var(--income-color)"}
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}
