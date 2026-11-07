const express = require("express");
const protect = require("../middleware/auth");
const controller = require("../controllers/transactionController");
const router = express.Router();

router.use(protect);
router.get("/", controller.getTransactions);
router.post("/", controller.createTransaction);
router.put("/:id", controller.updateTransaction);
router.delete("/:id", controller.deleteTransaction);

module.exports = router;
