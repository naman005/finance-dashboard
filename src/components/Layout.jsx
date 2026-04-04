import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Moon,
  Sun,
  Shield,
  Eye,
} from "lucide-react";
import styles from "../stylesheets/components/Layout.module.css";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/income", label: "Income", icon: TrendingUp },
  { path: "/expenses", label: "Expenses", icon: TrendingDown },
  { path: "/insights", label: "Insights", icon: Lightbulb },
];

export default function Layout() {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.label ||
    "Dashboard";

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>Z</div>
            <span className={styles.logoText}>Zorvyn</span>
          </div>

          <nav className={styles.nav}>
            <span className={styles.navLabel}>Main</span>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.roleSection}>
              <span className={styles.roleLabel}>Role</span>
              <div className={styles.roleToggle}>
                <button
                  className={`${styles.roleBtn} ${state.role === "admin" ? styles.roleActive : ""}`}
                  onClick={() =>
                    dispatch({ type: "SET_ROLE", payload: "admin" })
                  }
                >
                  <Shield size={12} /> Admin
                </button>
                <button
                  className={`${styles.roleBtn} ${state.role === "viewer" ? styles.roleActive : ""}`}
                  onClick={() =>
                    dispatch({ type: "SET_ROLE", payload: "viewer" })
                  }
                >
                  <Eye size={12} /> Viewer
                </button>
              </div>
            </div>

            <button
              className={styles.themeBtn}
              onClick={() => dispatch({ type: "TOGGLE_DARK" })}
              title="Toggle theme"
            >
              {state.darkMode ? <Sun size={15} /> : <Moon size={15} />}
              <span>{state.darkMode ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className={styles.userCard}>
              <div className={styles.userAvatar}>N</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Naman C.</span>
                <span className={styles.userRole}>
                  {state.role === "admin" ? "Administrator" : "Viewer"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <main className={styles.main}>
        {/* <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.rolePill}>
              {state.role === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
              <span>{state.role === 'admin' ? 'Admin' : 'Viewer'}</span>
            </div>
            <button
              className={styles.themeIconBtn}
              onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            >
              {state.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header> */}

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
