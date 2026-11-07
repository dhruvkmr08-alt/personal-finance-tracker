const express = require("express");
const protect = require("../middleware/auth");
const controller = require("../controllers/budgetController");
const router = express.Router();

router.use(protect);
router.get("/", controller.getBudget);
router.put("/", controller.setBudget);

module.exports = router;
