import { useEffect, useState } from "react";
import api from "../api";

const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);
const thisMonth = new Date().toISOString().slice(0, 7);

export default function Budget() {
  const [month, setMonth] = useState(thisMonth);
  const [budget, setBudget] = useState({ amount: 0, spent: 0, remaining: 0 });
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [budgetResponse, categoryResponse] = await Promise.all([
        api.get("/budget", { params: { month } }), api.get("/categories")
      ]);
      setBudget(budgetResponse.data);
      setAmount(budgetResponse.data.amount || "");
      setCategories(categoryResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load budget details.");
    }
  }
  useEffect(() => { load(); }, [month]);

  async function saveBudget(event) {
    event.preventDefault();
    setError(""); setMessage("");
    if (amount === "" || Number(amount) < 0) return setError("Enter a valid budget amount.");
    try {
      await api.put("/budget", { month, amount: Number(amount) });
      setMessage("Monthly budget saved.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save budget.");
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!name.trim()) return setError("Enter a category name.");
    try {
      await api.post("/categories", { name, type: categoryType });
      setName("");
      setMessage("Category added.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category.");
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category? Existing transactions will not be deleted.")) return;
    try {
      await api.delete(`/categories/${id}`);
      setMessage("Category deleted.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  }

  const percentage = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
  const exceeded = budget.amount > 0 && budget.spent > budget.amount;

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">PLAN AHEAD</p><h1>Budget & Categories</h1><p className="muted">Set a monthly limit and organise your transactions.</p></div></div>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <section className="budget-grid">
        <div className="panel">
          <div className="panel-heading"><h3>Monthly spending budget</h3><input className="month-input" type="month" value={month} onChange={e => setMonth(e.target.value)} /></div>
          <form onSubmit={saveBudget} className="budget-form">
            <label>Budget amount (₹)<input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter monthly budget" /></label>
            <button className="primary-btn">Save budget</button>
          </form>
          <div className="budget-stats"><div><span>Budget</span><strong>{money(budget.amount)}</strong></div><div><span>Spent</span><strong className="red-text">{money(budget.spent)}</strong></div><div><span>Remaining</span><strong className={budget.remaining < 0 ? "red-text" : "green-text"}>{money(budget.remaining)}</strong></div></div>
          <div className="budget-track"><div className={exceeded ? "budget-fill over" : "budget-fill"} style={{ width: `${percentage}%` }}></div></div>
          <p className={`budget-note ${exceeded ? "red-text" : ""}`}>{budget.amount === 0 ? "Set a budget to track your monthly spending." : exceeded ? "You have exceeded your monthly budget." : `${percentage.toFixed(0)}% of your monthly budget has been used.`}</p>
        </div>
        <div className="panel">
          <h3>Add a category</h3>
          <form onSubmit={addCategory} className="category-form">
            <label>Category name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Education" /></label>
            <label>Type<select value={categoryType} onChange={e => setCategoryType(e.target.value)}><option value="expense">Expense</option><option value="income">Income</option></select></label>
            <button className="primary-btn">Add category</button>
          </form>
        </div>
      </section>
      <section className="panel">
        <h3>Your categories</h3>
        {categories.length === 0 ? <p className="empty">No custom categories yet. Add one above.</p> :
          <div className="category-list">{categories.map(c => <div className="category-item" key={c._id}><span>{c.name}</span><span className={`type-pill ${c.type}`}>{c.type}</span><button className="text-btn danger-btn" onClick={() => deleteCategory(c._id)}>Delete</button></div>)}</div>}
      </section>
    </>
  );
}
