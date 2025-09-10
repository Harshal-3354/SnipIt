const Link = require("../models/Link");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

// @desc Create short URL
exports.createLink = async (req, res) => {
  try {
    const { originalUrl, customAlias, expirationDate, password } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    let shortId;

    if (customAlias) {
      // Check if custom alias already taken
      const aliasExists = await Link.findOne({ shortId: customAlias });
      if (aliasExists) {
        return res.status(400).json({ message: "Custom alias already taken" });
      }
      shortId = customAlias; // ✅ Use custom alias as shortId
    } else {
      // Generate unique shortId
      let isUnique = false;
      while (!isUnique) {
        const candidate = nanoid(7);
        const exists = await Link.findOne({ shortId: candidate });
        if (!exists) {
          shortId = candidate;
          isUnique = true;
        }
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newLink = await Link.create({
      owner: req.user.id,
      originalUrl,
      shortId,
      expirationDate: expirationDate || null,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Link created successfully",
      link: newLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all user links
exports.getMyLinks = async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, owner: req.user.id });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    await Link.deleteOne({ _id: req.params.id });
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
