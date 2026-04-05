import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { MONTHLY_DATA } from "../../data/mockData";
import { formatAmount } from "../../utils/helpers";
import styles from "../../stylesheets/pages/Dashboard.module.css";

const AreaTooltip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map(p=>(
        <p key={p.name} style={{color:p.color,fontFamily:"var(--font-mono)",fontWeight:500}}>
          {p.name}: {formatAmount(p.value)}
        </p>
      ))}
    </div>
  );
};


export default function CashFlowChart() {
  return (
    <div className={`card ${styles.chartCard}`}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Cash Flow</h3>
          <p className={styles.chartSub}>Income vs Expenses — last 6 months</p>
        </div>
        <Link to="/insights" className="btn btn-ghost" style={{ fontSize: 12 }}>
          View Insights <ArrowRight size={13} />
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart
          data={MONTHLY_DATA}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.2} />
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
            tickFormatter={(v) => formatAmount(v)}
          />
          <Tooltip content={<AreaTooltip />} />
          <Legend
            iconType="circle"
            iconSize={7}
            formatter={(v) => (
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {v}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#2D6A4F"
            strokeWidth={2}
            fill="url(#incGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#C0392B"
            strokeWidth={2}
            fill="url(#expGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
