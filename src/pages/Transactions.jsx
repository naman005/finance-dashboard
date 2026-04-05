import { useState } from "react";
import { useApp, useFilteredTransactions } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import TransactionRow from "../components/TransactionRow";
import AddTransactionModal from "../components/AddTransactionModal";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import styles from "../stylesheets/pages/Transactions.module.css";

export default function Transactions() {
  const { state, dispatch } = useApp();
  const filtered = useFilteredTransactions();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { filters } = state;

  function setFilter(obj) {
    dispatch({ type: "SET_FILTER", payload: obj });
  }

  function handleSort(field) {
    if (filters.sortBy === field) {
      setFilter({ sortDir: filters.sortDir === "desc" ? "asc" : "desc" });
    } else {
      setFilter({ sortBy: field, sortDir: "desc" });
    }
  }

  function exportCSV() {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map((t) => [
      t.date,
      `"${t.description}"`,
      CATEGORIES[t.category]?.label || t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field)
      return <ChevronDown size={13} style={{ opacity: 0.3 }} />;
    return filters.sortDir === "desc" ? (
      <ChevronDown size={13} style={{ color: "var(--accent-primary)" }} />
    ) : (
      <ChevronUp size={13} style={{ color: "var(--accent-primary)" }} />
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Transactions</h2>
          <p className={styles.sub}>
            {filtered.length} of {state.transactions.length} records
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
          {state.role === "admin" && (
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      <div className={`card ${styles.filterBar}`}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
          />
        </div>

        <div className={styles.filterRow}>
          <div className={styles.filterChips}>
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                className={`${styles.chip} ${filters.type === type ? styles.chipActive : ""}`}
                onClick={() => setFilter({ type })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <button
            className={`btn btn-secondary ${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={`card ${styles.expandedFilters}`}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select
              className={styles.filterSelect}
              value={filters.category}
              onChange={(e) => setFilter({ category: e.target.value })}
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by</label>
            <select
              className={styles.filterSelect}
              value={filters.sortBy}
              onChange={(e) => setFilter({ sortBy: e.target.value })}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Order</label>
            <select
              className={styles.filterSelect}
              value={filters.sortDir}
              onChange={(e) => setFilter({ sortDir: e.target.value })}
            >
              <option value="desc">Newest / Highest</option>
              <option value="asc">Oldest / Lowest</option>
            </select>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setFilter({
                search: "",
                type: "all",
                category: "all",
                sortBy: "date",
                sortDir: "desc",
              });
              setShowFilters(false);
            }}
          >
            Reset all
          </button>
        </div>
      )}

      <div className={`card ${styles.tableCard}`}>
        <div className={styles.tableHeader}>
          <span>Transaction</span>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "50%",
              gap: "24px",
            }}
          >
            <span
              className={styles.sortableDate}
              onClick={() => handleSort("date")}
            >
              Date <SortIcon field="date" />
            </span>
            {state.role === "admin" && <span>Actions</span>}
            <span
              className={styles.sortableAmount}
              onClick={() => handleSort("amount")}
            >
              Amount <SortIcon field="amount" />
            </span>
          </div>
        </div>

        <div className={styles.txList}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>No transactions found.</span>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Try adjusting your filters.
              </span>
            </div>
          ) : (
            filtered.map((t) => <TransactionRow key={t.id} transaction={t} />)
          )}
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
