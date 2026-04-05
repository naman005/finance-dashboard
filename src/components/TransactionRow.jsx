import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import styles from "../stylesheets/components/TransactionRow.module.css";
import { formatDate, formatAmount } from "../utils/helpers";

export default function TransactionRow({ transaction }) {
  const { state, dispatch } = useApp();
  const [editing,  setEditing]  = useState(false);
  const [editData, setEditData] = useState({ ...transaction });

  const cat     = CATEGORIES[transaction.category] || { label: transaction.category, icon:"💳", color:"#888" };
  const isAdmin = state.role === "admin";

  function handleDelete() {
    if (window.confirm("Delete this transaction?")) {
      dispatch({ type:"DELETE_TRANSACTION", payload: transaction.id });
    }
  }

  function handleSave() {
    dispatch({ type:"EDIT_TRANSACTION", payload:{ ...editData, amount: Number(editData.amount) } });
    setEditing(false);
  }

  /* ── EDIT MODE ── */
  if (editing) {
    return (
      <div className={`${styles.row} ${styles.editRow}`}>
        <input
          className={styles.editInput}
          value={editData.description}
          onChange={e => setEditData({ ...editData, description: e.target.value })}
          placeholder="Description"
        />
        <select
          className={styles.editInput}
          value={editData.category}
          onChange={e => setEditData({ ...editData, category: e.target.value })}
        >
          {Object.entries(CATEGORIES).map(([key,{label,icon}]) => (
            <option key={key} value={key}>{icon} {label}</option>
          ))}
        </select>
        <input
          className={styles.editInput}
          type="date"
          value={editData.date}
          onChange={e => setEditData({ ...editData, date: e.target.value })}
        />
        <select
          className={styles.editInput}
          value={editData.type}
          onChange={e => setEditData({ ...editData, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          className={`${styles.editInput} ${styles.amountInput}`}
          type="number" min="1"
          value={editData.amount}
          onChange={e => setEditData({ ...editData, amount: e.target.value })}
        />
        <div className={styles.editActions}>
          <button className={styles.saveBtn}  onClick={handleSave}           title="Save"><Check size={14}/></button>
          <button className={styles.cancelBtn} onClick={()=>setEditing(false)} title="Cancel"><X size={14}/></button>
        </div>
      </div>
    );
  }

  /* ── READ MODE ── */
  return (
    <div className={styles.row}>

      {/* Description + icon */}
      <div className={styles.nameCell}>
        <div className={styles.icon} style={{ background: cat.color+"18", color: cat.color }}>
          {cat.icon}
        </div>
        <div className={styles.nameInfo}>
          <span className={styles.desc}>{transaction.description}</span>
          <span className={styles.type}>{transaction.type}</span>
        </div>
      </div>

      {/* Category badge */}
      <span className={`badge badge-${transaction.type}`}>{cat.label}</span>

      {/* Date */}
      <span className={styles.date}>{formatDate(transaction.date)}</span>

      {/* Actions (admin) — always reserve space so amount doesn't jump */}
      <div className={styles.actionsCell}>
        {isAdmin && (
          <div className={styles.actionBtns}>
            <button className={styles.actionBtn} onClick={()=>setEditing(true)} title="Edit">
              <Pencil size={13}/>
            </button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete} title="Delete">
              <Trash2 size={13}/>
            </button>
          </div>
        )}
      </div>

      {/* Amount */}
      <span className={`${styles.amount} ${transaction.type==="income" ? styles.income : styles.expense}`}>
        {transaction.type==="income" ? "+" : "−"}{formatAmount(transaction.amount)}
      </span>

    </div>
  );
}
