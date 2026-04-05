import { useState, useCallback } from "react";
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
  Menu,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import styles from "../stylesheets/components/Layout.module.css";

const NAV_ITEMS = [
  { path: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight  },
  { path: "/income",       label: "Income",       icon: TrendingUp      },
  { path: "/expenses",     label: "Expenses",     icon: TrendingDown    },
  { path: "/insights",     label: "Insights",     icon: Lightbulb       },
];

export default function Layout() {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className={styles.layout}>

      {/* ── SIDEBAR ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.sidebarInner}>

          {/* Logo + close btn on mobile */}
          <div className={styles.logo}>
            <div className={styles.logoMark}>Z</div>
            <span className={styles.logoText}>Zorvyn</span>
            <button className={styles.sidebarClose} onClick={closeSidebar} aria-label="Close menu">
              <X size={16} />
            </button>
          </div>

          {/* Nav links */}
          <nav className={styles.nav}>
            <span className={styles.navLabel}>Main</span>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                onClick={closeSidebar}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer: role + theme + user */}
          <div className={styles.sidebarFooter}>
            <div className={styles.roleSection}>
              <span className={styles.roleLabel}>Role</span>
              <div className={styles.roleToggle}>
                <button
                  className={`${styles.roleBtn} ${state.role === "admin" ? styles.roleActive : ""}`}
                  onClick={() => dispatch({ type: "SET_ROLE", payload: "admin" })}
                >
                  <Shield size={12} /> Admin
                </button>
                <button
                  className={`${styles.roleBtn} ${state.role === "viewer" ? styles.roleActive : ""}`}
                  onClick={() => dispatch({ type: "SET_ROLE", payload: "viewer" })}
                >
                  <Eye size={12} /> Viewer
                </button>
              </div>
            </div>

            <button
              className={styles.themeBtn}
              onClick={() => dispatch({ type: "TOGGLE_DARK" })}
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

      {/* Backdrop overlay (mobile only) */}
      {mobileOpen && (
        <div className={styles.backdrop} onClick={closeSidebar} />
      )}

      {/* ── MAIN AREA ── */}
      <main className={styles.main}>

        {/* Slim mobile top bar — just hamburger + logo */}
        <div className={styles.mobileBar}>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className={styles.mobileLogoText}>Zorvyn</span>
          {/* Action buttons also accessible on mobile bar */}
          <div className={styles.mobileActions}>
            <button
              className={styles.iconBtn}
              onClick={() => dispatch({ type: "SET_ROLE", payload: state.role === "admin" ? "viewer" : "admin" })}
              title={`Switch to ${state.role === "admin" ? "Viewer" : "Admin"}`}
            >
              {state.role === "admin" ? <Shield size={15} /> : <Eye size={15} />}
            </button>
            <button
              className={styles.iconBtn}
              onClick={() => dispatch({ type: "TOGGLE_DARK" })}
              title="Toggle theme"
            >
              {state.darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className={styles.iconBtn}
              onClick={toggleFullscreen}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* Page content — Dashboard injects its own header with action buttons */}
        <div className={styles.content}>
          {/* Pass controls as context so Dashboard can render them in its header */}
          <Outlet context={{ toggleFullscreen, isFullscreen }} />
        </div>
      </main>
    </div>
  );
}
