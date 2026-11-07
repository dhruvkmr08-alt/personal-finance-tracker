import { useEffect, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "", amount: "", type: "expense", category: "Food", date: today
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        amount: initial.amount,
        type: initial.type,
        category: initial.category,
        date: new Date(initial.date).toISOString().slice(0, 10)
      });
    }
  }, [initial]);

  const available = categories.filter(c => c.type === form.type).map(c => c.name);
  const defaults = form.type === "income"
    ? ["Salary", "Freelance", "Investment", "Other"]
    : ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];
  const options = [...new Set([...available, ...defaults])];

  function change(event) {
    const { name, value } = event.target;
    setForm(old => ({
      ...old,
      [name]: value,
      ...(name === "type" ? { category: value === "income" ? "Salary" : "Food" } : {})
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.category || !form.date) {
      setError("Please complete every field and enter an amount greater than zero.");
      return;
    }
    try {
      await onSave({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save transaction.");
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>{initial ? "Edit transaction" : "Add a transaction"}</h3>
      {error && <p className="message error">{error}</p>}
      <label>Title / Description<input name="title" value={form.title} onChange={change} placeholder="e.g. Monthly salary" /></label>
      <div className="form-row">
        <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="0.00" /></label>
        <label>Type<select name="type" value={form.type} onChange={change}><option value="expense">Expense</option><option value="income">Income</option></select></label>
      </div>
      <div className="form-row">
        <label>Category<select name="category" value={form.category} onChange={change}>{options.map(option => <option key={option}>{option}</option>)}</select></label>
        <label>Date<input name="date" type="date" value={form.date} onChange={change} /></label>
      </div>
      <div className="button-row">
        <button className="primary-btn" type="submit">Save transaction</button>
        {onCancel && <button className="secondary-btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
