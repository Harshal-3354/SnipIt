const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createLink,
  getMyLinks,
  deleteLink,
} = require("../controllers/linkController");

router.post("/create", authMiddleware, createLink);
router.get("/my", authMiddleware, getMyLinks);
router.delete("/:id/delete", authMiddleware, deleteLink);

module.exports = router;
