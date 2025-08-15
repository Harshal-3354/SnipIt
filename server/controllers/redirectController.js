const Link = require("../models/Link");
const Visit = require("../models/Visit");
const bcrypt = require("bcryptjs");
const useragent = require("useragent");
const axios = require("axios");

exports.redirectLink = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;

    const link = await Link.findOne({
      $or: [{ shortId: shortCode }, { customAlias: shortCode }],
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check expiration
    if (link.expirationDate && new Date() > link.expirationDate) {
      return res.status(410).json({ message: "Link has expired" });
    }

    // Check password protection
    if (link.password) {
      const { password } = req.query;
      if (!password) {
        return res.status(401).json({ message: "Password required" });
      }
      const isMatch = await bcrypt.compare(password, link.password);
      if (!isMatch) {
        return res.status(403).json({ message: "Invalid password" });
      }
    }

    // Extract analytics info
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers["user-agent"]);
    let location = { country: "Unknown", region: "Unknown", city: "Unknown" };

    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
      if (geoRes.data.status === "success") {
        location = {
          country: geoRes.data.country,
          region: geoRes.data.regionName,
          city: geoRes.data.city,
        };
      }
    } catch (err) {
      console.log("🌍 Location lookup failed:", err.message);
    }

    // Save visit
    await Visit.create({
      link: link._id,
      ip,
      device: agent.device.toString(),
      browser: `${agent.family} ${agent.major}`,
      location,
    });

    // Increment click count
    link.clickCount += 1;
    await link.save();

    // Redirect
    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
