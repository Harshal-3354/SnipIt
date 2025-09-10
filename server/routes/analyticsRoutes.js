const express = require("express");
const router = express.Router();
const { getLinkAnalytics } = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, getLinkAnalytics);

module.exports = router;
