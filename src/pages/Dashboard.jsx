import { useState } from "react";
import { useApp } from "../context/AppContext";
import { USER } from "../data/mockData";
import StatCard from "../components/StatCard";
import AddTransactionModal from "../components/AddTransactionModal";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import styles from "../stylesheets/pages/Dashboard.module.css";
import HeaderActions from "../components/dashboard-components/HeaderActions";
import CashFlowChart from "../components/dashboard-components/CashFlowChart";
import SpendingPie from "../components/dashboard-components/SpendingPie";
import QuickStat from "../components/dashboard-components/QuickStat";
import { TransactionTable } from "../components/TransactionTable";

const INCOME_SPARK = [80, 95, 88, 102, 99, 115, 108, 122, 118, 138];
const EXPENSE_SPARK = [42, 38, 51, 44, 60, 55, 48, 52, 45, 50];
const BALANCE_SPARK = [38, 57, 37, 58, 39, 60, 60, 70, 73, 88];

function calcStats(transactions) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}


export default function Dashboard() {
  const { state } = useApp();
  const [showModal, setShowModal] = useState(false);
  const { income, expenses, balance } = calcStats(state.transactions);
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  const now = new Date();
  const thisMo = state.transactions.filter(
    (t) => new Date(t.date).getMonth() === now.getMonth(),
  );
  const lastMo = state.transactions.filter(
    (t) => new Date(t.date).getMonth() === now.getMonth() - 1,
  );
  const thisInc = thisMo
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const lastInc = lastMo
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const thisExp = thisMo
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const lastExp = lastMo
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const incChange =
    lastInc > 0 ? Math.round(((thisInc - lastInc) / lastInc) * 100) : 12;
  const expChange =
    lastExp > 0 ? Math.round(((thisExp - lastExp) / lastExp) * 100) : -8;
  const savingsRate =
    income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const latestDate = state.transactions.length
  ? new Date(
      Math.max(...state.transactions.map(t => new Date(t.date)))
    )
  : new Date();
  const monthLabel = latestDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.greeting}>Welcome Back,&nbsp;{USER.name}!</h2>
          <p className={styles.subtext}>
            Here's your financial summary for {monthLabel}
          </p>
        </div>

        <HeaderActions setShowModal={setShowModal} />
      </div>

      <div className={styles.body}>
        <div className={styles.leftCol}>
          <div className={styles.statsGrid}>
            <StatCard
              label="Total Balance"
              value={balance}
              change={savingsRate}
              changeLabel="savings rate"
              variant="balance"
              icon={<Wallet size={14} />}
              sparkData={BALANCE_SPARK}
              sparkColor="var(--income-color)"
            />
            <StatCard
              label="Total Income"
              value={income}
              change={incChange}
              variant="income"
              icon={<TrendingUp size={14} />}
              sparkData={INCOME_SPARK}
              sparkColor="#2D6A4F"
            />
            <StatCard
              label="Total Expenses"
              value={expenses}
              change={expChange}
              variant="expense"
              icon={<TrendingDown size={14} />}
              sparkData={EXPENSE_SPARK}
              sparkColor="#C0392B"
            />
          </div>
          <CashFlowChart />
          {/* RECENT TRANSACTIONS TABLE */}
          <TransactionTable transactions={recent} />
        </div>

        <div className={styles.rightPanel}>
          <SpendingPie />
          <QuickStat income={income} expenses={expenses} savingsRate={savingsRate} state={state} />
        </div>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
