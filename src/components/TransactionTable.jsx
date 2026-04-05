import styles from "../stylesheets/pages/Dashboard.module.css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TransactionRow from "./TransactionRow";

export function TransactionTable({ transactions }) {
  return (
    <div className={`card ${styles.txCard}`}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Recent Transactions</h3>
          <p className={styles.chartSub}>{transactions.length} total records</p>
        </div>
        <Link
          to="/transactions"
          className="btn btn-ghost"
          style={{ fontSize: 12 }}
        >
          See All <ArrowRight size={13} />
        </Link>
      </div>
      <div className={styles.txTableHead}>
        <span>Description</span>
        <span>Category</span>
        <span>Date</span>
        <span style={{ textAlign: "right" }}>Amount</span>
      </div>
      <div className={styles.txTableBody}>
        {transactions.length === 0 ? (
          <div className={styles.empty}>
            No transactions yet. Add one to get started.
          </div>
        ) : (
          transactions.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
