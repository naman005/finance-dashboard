import styles from "../stylesheets/components/StatCard.module.css";
import { LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatAmount } from "../utils/helpers";

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

      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <div className={styles.iconWrap}>{icon}</div>}
      </div>

      <div className={styles.value}>{formatAmount(value)}</div>

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
