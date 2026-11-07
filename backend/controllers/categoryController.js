const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.userId }).sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Could not load categories." });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type = "expense" } = req.body;
    if (!name || !name.trim() || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Enter a category name and valid type." });
    }
    const category = await Category.create({ user: req.userId, name: name.trim(), type });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "This category already exists." });
    res.status(500).json({ message: "Could not create category." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete category." });
  }
};
