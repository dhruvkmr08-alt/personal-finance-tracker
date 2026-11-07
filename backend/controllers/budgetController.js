const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

exports.getBudget = async (req, res) => {
  try {
    const month = req.query.month || currentMonth();
    const budget = await Budget.findOne({ user: req.userId, month });
    const [year, monthNumber] = month.split("-").map(Number);
    const start = new Date(year, monthNumber - 1, 1);
    const end = new Date(year, monthNumber, 1);
    const expenses = await Transaction.find({
      user: req.userId, type: "expense", date: { $gte: start, $lt: end }
    });
    const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const amount = budget ? budget.amount : 0;
    res.json({ month, amount, spent, remaining: amount - spent });
  } catch (error) {
    res.status(500).json({ message: "Could not load budget." });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { amount, month } = req.body;
    if (!month || !/^\d{4}-\d{2}$/.test(month) || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({ message: "Enter a valid month and budget amount." });
    }
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month },
      { amount: Number(amount) },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Could not save budget." });
  }
};
