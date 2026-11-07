import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value || 0);
const dateText = value => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard.");
    }
  }
  useEffect(() => { load(); }, []);

  if (error) return <p className="message error">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  const total = data.monthlyIncome + data.monthlyExpenses;
  const incomeWidth = total ? data.monthlyIncome / total * 100 : 0;
  const expenseWidth = total ? data.monthlyExpenses / total * 100 : 0;

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Here is your financial snapshot.</p></div><Link className="primary-link" to="/transactions">+ Add transaction</Link></div>
      <section className="stat-grid">
        <div className="stat-card balance-card"><span>Total balance</span><h2>{money(data.balance)}</h2><small>Income minus expenses</small></div>
        <div className="stat-card"><span>Total income</span><h2 className="green-text">{money(data.income)}</h2><small>All recorded income</small></div>
        <div className="stat-card"><span>Total expenses</span><h2 className="red-text">{money(data.expenses)}</h2><small>All recorded expenses</small></div>
      </section>
      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading"><div><h3>This month's summary</h3><p className="muted">Income compared with expenses</p></div><span className="month-chip">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span></div>
          <div className="summary-numbers"><div><span className="dot income-dot"></span> Income <strong>{money(data.monthlyIncome)}</strong></div><div><span className="dot expense-dot"></span> Expenses <strong>{money(data.monthlyExpenses)}</strong></div></div>
          <div className="bar-track"><div className="bar-income" style={{ width: `${incomeWidth}%` }}></div><div className="bar-expense" style={{ width: `${expenseWidth}%` }}></div></div>
          <p className="muted small">The bar shows this month's income and expenses as a share of their combined total.</p>
        </div>
        <div className="panel">
          <div className="panel-heading"><h3>Quick links</h3></div>
          <Link className="quick-link" to="/transactions">↕ <span><strong>Transactions</strong><small>Add or review your activity</small></span> →</Link>
          <Link className="quick-link" to="/budget">◎ <span><strong>Budget & Categories</strong><small>Plan your monthly spending</small></span> →</Link>
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading"><h3>Recent transactions</h3><Link to="/transactions">View all →</Link></div>
        {data.recentTransactions.length === 0 ? <p className="empty">No transactions yet. Add your first transaction to get started.</p> :
          <div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Type</th><th className="right">Amount</th></tr></thead><tbody>
            {data.recentTransactions.map(t => <tr key={t._id}><td><strong>{t.title}</strong></td><td>{t.category}</td><td>{dateText(t.date)}</td><td><span className={`type-pill ${t.type}`}>{t.type}</span></td><td className={`right ${t.type === "income" ? "green-text" : "red-text"}`}>{t.type === "income" ? "+" : "-"}{money(t.amount)}</td></tr>)}
          </tbody></table></div>}
      </section>
    </>
  );
}
