import styles from "../../stylesheets/pages/Dashboard.module.css";
import { formatAmount } from "../../utils/helpers";

export default function QuickStat({ income, expenses, savingsRate, state }) {
  return (
    <div className={`card ${styles.quickCard}`}>
      <h3 className={styles.chartTitle} style={{ marginBottom: 14 }}>
        This Month
      </h3>
      <div
       className={styles.quickList}>
        {[
          {
            dot: "var(--income-color)",
            label: "Net Savings",
            val: formatAmount(income - expenses),
            cls: styles.amtInc,
          },
          {
            dot: "var(--accent-primary)",
            label: "Savings Rate",
            val: `${savingsRate}%`,
            cls: "",
          },
          {
            dot: "#457B9D",
            label: "Transactions",
            val: state.transactions.length,
            cls: "",
          },
          {
            dot: "var(--expense-color)",
            label: "Avg Expense",
            val: formatAmount(
              Math.round(
                expenses /
                  Math.max(
                    state.transactions.filter((t) => t.type === "expense")
                      .length,
                    1,
                  ),
              ),
            ),
            cls: styles.amtExp,
          },
        ].map(({ dot, label, val, cls }) => (
          <div key={label} className={styles.quickRow}>
            <div className={styles.quickDot} style={{ background: dot }} />
            <span className={styles.quickLabel}>{label}</span>
            <span className={`${styles.quickVal} ${cls}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}