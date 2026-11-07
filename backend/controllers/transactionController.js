const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.type && ["income", "expense"].includes(req.query.type)) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Could not load transactions." });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    if (!title || amount === undefined || !type || !category || !date) {
      return res.status(400).json({ message: "Please fill in every transaction field." });
    }
    if (!["income", "expense"].includes(type) || Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
      return res.status(400).json({ message: "Enter a valid amount and transaction type." });
    }
    const transaction = await Transaction.create({
      user: req.userId, title: title.trim(), amount: Number(amount), type,
      category: category.trim(), date: new Date(date)
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Could not add transaction." });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    if (!title || !category || !date || !["income", "expense"].includes(type) ||
        !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Please enter valid transaction details." });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title: title.trim(), amount: Number(amount), type, category: category.trim(), date: new Date(date) },
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Could not update transaction." });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });
    res.json({ message: "Transaction deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete transaction." });
  }
};
