import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/invoice", label: "Invoice Decision" },
  { to: "/support", label: "Support Escalation" },
  { to: "/memory", label: "Memory Explorer" },
  { to: "/logs", label: "Decision Logs" }
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Context and Memory Management Agent</h1>
        <p className="muted">Enterprise decision workspace</p>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
