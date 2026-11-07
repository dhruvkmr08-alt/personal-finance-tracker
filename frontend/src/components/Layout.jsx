import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Pocket<span>Track</span></div>
        <p className="side-caption">PERSONAL FINANCE</p>
        <nav>
          <NavLink to="/">▦ Dashboard</NavLink>
          <NavLink to="/transactions">↕ Transactions</NavLink>
          <NavLink to="/budget">◎ Budget & Categories</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-small">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info"><strong>{user?.name}</strong><small>{user?.email}</small></div>
          <button className="logout" onClick={handleLogout} title="Log out">↪</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
