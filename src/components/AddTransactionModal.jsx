import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import styles from "../stylesheets/components/AddTransactionModal.module.css";

export default function AddTransactionModal({ onClose, defaultType }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: defaultType === "expense" ? "food" : "salary",
    type: defaultType || "income",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError]           = useState("");
  const [customCat, setCustomCat]   = useState("");
  const [showCustom, setShowCustom] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.amount || Number(form.amount) <= 0) return setError("Enter a valid amount");

    const finalCategory = showCustom && customCat.trim()
      ? customCat.trim().toLowerCase().replace(/\s+/g, "_")
      : form.category;

    dispatch({
      type: "ADD_TRANSACTION",
      payload: { ...form, category: finalCategory, id: Date.now(), amount: Number(form.amount) },
    });
    onClose();
  }

  const categoryEntries = Object.entries(CATEGORIES);

  return createPortal(
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2 className={styles.title}>Add Transaction</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18}/></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.typeToggle}>
            {["income","expense"].map(t => (
              <button
                key={t} type="button"
                className={`${styles.typeBtn} ${form.type===t ? styles[t] : ""}`}
                onClick={() => setForm({ ...form, type:t })}
              >
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <input
              className={styles.input}
              value={form.description}
              onChange={e => setForm({ ...form, description:e.target.value })}
              placeholder="e.g. Monthly Salary, Grocery Run..."
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Amount (₹)</label>
              <input
                className={styles.input} type="number" min="1"
                value={form.amount}
                onChange={e => setForm({ ...form, amount:e.target.value })}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input} type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date:e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            {!showCustom ? (
              <>
                <select
                  className={styles.input}
                  value={form.category}
                  onChange={e => setForm({ ...form, category:e.target.value })}
                >
                  {categoryEntries.map(([key,{label,icon}]) => (
                    <option key={key} value={key}>{icon} {label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.customLink}
                  onClick={() => setShowCustom(true)}
                >
                  <Plus size={12}/> Add new category
                </button>
              </>
            ) : (
              <>
                <input
                  className={styles.input}
                  value={customCat}
                  onChange={e => setCustomCat(e.target.value)}
                  placeholder="e.g. Gym, Gifts, Pet Care..."
                  autoFocus
                />
                <button
                  type="button"
                  className={styles.customLink}
                  onClick={() => { setShowCustom(false); setCustomCat(""); }}
                >
                  ← Use existing category
                </button>
              </>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>, document.body
  );
}
