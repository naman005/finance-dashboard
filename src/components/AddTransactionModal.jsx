import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import styles from "../stylesheets/components/AddTransactionModal.module.css";

export default function AddTransactionModal({ onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "salary",
    type: "income",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) return setError("Description is required");
    if (!form.amount || Number(form.amount) <= 0)
      return setError("Enter a valid amount");
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        ...form,
        id: Date.now(),
        amount: Number(form.amount),
      },
    });
    onClose();
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Transaction</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeToggle}>
            {["income", "expense"].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.typeBtn} ${form.type === t ? styles[t] : ""}`}
                onClick={() => setForm({ ...form, type: t })}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <input
              className={styles.input}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="e.g. Monthly Salary, Grocery Run..."
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Amount (₹)</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input}
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.input}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {Object.entries(CATEGORIES).map(([key, { label, icon }]) => (
                <option key={key} value={key}>
                  {icon} {label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
