import { useEffect, useState } from "react";
import api from "../api";
import TransactionForm from "../components/TransactionForm";

const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);
const dateText = value => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const params = {};
      if (type !== "all") params.type = type;
      if (category !== "all") params.category = category;
      const [txResponse, catResponse] = await Promise.all([
        api.get("/transactions", { params }), api.get("/categories")
      ]);
      setTransactions(txResponse.data);
      setCategories(catResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load transactions.");
    }
  }
  useEffect(() => { load(); }, [type, category]);

  async function save(form) {
    if (editing) await api.put(`/transactions/${editing._id}`, form);
    else await api.post("/transactions", form);
    setEditing(null);
    setShowForm(false);
    setMessage(editing ? "Transaction updated." : "Transaction added.");
    await load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setMessage("Transaction deleted.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete transaction.");
    }
  }

  function startEdit(item) {
    setEditing(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">YOUR MONEY</p><h1>Transactions</h1><p className="muted">Keep track of every amount coming in and going out.</p></div><button className="primary-btn" onClick={() => { setEditing(null); setShowForm(!showForm); }}>+ Add transaction</button></div>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      {showForm && <TransactionForm initial={editing} categories={categories} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}
      <section className="panel">
        <div className="filter-row">
          <label>Type<select value={type} onChange={e => setType(e.target.value)}><option value="all">All transactions</option><option value="income">Income</option><option value="expense">Expenses</option></select></label>
          <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}</select></label>
        </div>
        {transactions.length === 0 ? <p className="empty">No transactions found. Try another filter or add a transaction.</p> :
          <div className="table-wrap"><table><thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Type</th><th className="right">Amount</th><th>Actions</th></tr></thead><tbody>
            {transactions.map(t => <tr key={t._id}><td><strong>{t.title}</strong></td><td>{t.category}</td><td>{dateText(t.date)}</td><td><span className={`type-pill ${t.type}`}>{t.type}</span></td><td className={`right ${t.type === "income" ? "green-text" : "red-text"}`}>{t.type === "income" ? "+" : "-"}{money(t.amount)}</td><td><button className="text-btn" onClick={() => startEdit(t)}>Edit</button><button className="text-btn danger-btn" onClick={() => remove(t._id)}>Delete</button></td></tr>)}
          </tbody></table></div>}
      </section>
    </>
  );
}
