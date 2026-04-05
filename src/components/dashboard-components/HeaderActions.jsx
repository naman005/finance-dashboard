import {
  Plus,
  Shield,
  Eye,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import styles from "../../stylesheets/pages/Dashboard.module.css";

export default function HeaderActions({ setShowModal }) {
  const { state, dispatch } = useApp();
  const [localFS, setLocalFS] = useState(false);
  let outletCtx = {};
  try {
    outletCtx = useOutletContext() || {};
  } catch {}

  const toggleFS =
    outletCtx.toggleFullscreen ||
    (() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
        setLocalFS(true);
      } else {
        document.exitFullscreen?.();
        setLocalFS(false);
      }
    });

  const fullscreen = outletCtx.isFullscreen ?? localFS;

  return (
    <div className={styles.headerActions}>
      <button
        className={`${styles.roundBtn} ${styles.rolePill}`}
        onClick={() =>
          dispatch({
            type: "SET_ROLE",
            payload: state.role === "admin" ? "viewer" : "admin",
          })
        }
        title={`Role: ${state.role} — click to switch`}
      >
        {state.role === "admin" ? <Shield size={14} /> : <Eye size={14} />}
        <span>{state.role === "admin" ? "Admin" : "Viewer"}</span>
      </button>

      <button
        className={styles.roundBtn}
        onClick={() => dispatch({ type: "TOGGLE_DARK" })}
        title="Toggle theme"
      >
        {state.darkMode ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <button
        className={styles.roundBtn}
        onClick={toggleFS}
        title="Toggle fullscreen"
      >
        {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>

      {state.role === "admin" && (
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Transaction
        </button>
      )}
    </div>
  );
}
