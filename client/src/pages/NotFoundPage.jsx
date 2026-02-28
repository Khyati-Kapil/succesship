import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card">
      <h2>Page Not Found</h2>
      <p className="muted">The page you requested does not exist.</p>
      <Link className="btn-link" to="/">Go to Dashboard</Link>
    </section>
  );
}
