const Transaction = require("../models/Transaction");

exports.getDashboard = async (req, res) => {
  try {
    const all = await Transaction.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    const income = all.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = all.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const thisMonth = all.filter(t => t.date >= start && t.date < end);
    const monthlyIncome = thisMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const monthlyExpenses = thisMonth.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    res.json({
      balance: income - expenses, income, expenses,
      monthlyIncome, monthlyExpenses, recentTransactions: all.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load dashboard." });
  }
};
