import { Link } from "react-router-dom";
import styles from "../stylesheets/pages/NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <div className={styles.divider} />
        <div className={styles.body}>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.sub}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
