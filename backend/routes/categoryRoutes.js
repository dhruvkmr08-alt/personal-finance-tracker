const express = require("express");
const protect = require("../middleware/auth");
const controller = require("../controllers/categoryController");
const router = express.Router();

router.use(protect);
router.get("/", controller.getCategories);
router.post("/", controller.createCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
