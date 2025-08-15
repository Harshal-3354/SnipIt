const express = require("express");
const router = express.Router();
const { redirectLink } = require("../controllers/redirectController");

router.get("/:shortCode", redirectLink);

module.exports = router;
