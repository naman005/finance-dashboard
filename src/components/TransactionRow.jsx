import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import styles from "../stylesheets/components/TransactionRow.module.css";

export default function TransactionRow({ transaction, compact = false }) {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...transaction });

  const cat = CATEGORIES[transaction.category] || {
    label: transaction.category,
    icon: "💳",
    color: "#888",
  };
  const isAdmin = state.role === "admin";

  function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function handleDelete() {
    if (window.confirm("Delete this transaction?")) {
      dispatch({ type: "DELETE_TRANSACTION", payload: transaction.id });
    }
  }

  function handleSave() {
    dispatch({
      type: "EDIT_TRANSACTION",
      payload: { ...editData, amount: Number(editData.amount) },
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className={`${styles.row} ${styles.editing}`}>
        <input
          className={styles.editInput}
          value={editData.description}
          onChange={(e) =>
            setEditData({ ...editData, description: e.target.value })
          }
          placeholder="Description"
        />
        <input
          className={`${styles.editInput} ${styles.amountInput}`}
          type="number"
          value={editData.amount}
          onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
        />
        <select
          className={styles.editInput}
          value={editData.type}
          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <div className={styles.actions}>
          <button className={`btn ${styles.saveBtn}`} onClick={handleSave}>
            <Check size={14} />
          </button>
          <button
            className={`btn ${styles.cancelBtn}`}
            onClick={() => setEditing(false)}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.row} ${compact ? styles.compact : ""}`}>
      <div
        className={styles.catIcon}
        style={{ background: cat.color + "18", color: cat.color }}
      >
        {cat.icon}
      </div>
      <div className={styles.info}>
        <span className={styles.desc}>{transaction.description}</span>
        {!compact && (
          <span className={styles.meta}>
            <span className={`badge badge-${transaction.type}`}>
              {cat.label}
            </span>
            <span className={styles.date}>{formatDate(transaction.date)}</span>
          </span>
        )}
        {compact && (
          <span className={styles.date}>{formatDate(transaction.date)}</span>
        )}
      </div>
      <div className={styles.right}>
        {isAdmin && !compact && (
          <div className={styles.rowActions}>
            <button
              className={styles.actionBtn}
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
        <span
          className={`${styles.amount} ${transaction.type === "income" ? styles.income : styles.expense}`}
        >
          {transaction.type === "income" ? "+" : "−"}₹
          {transaction.amount.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
