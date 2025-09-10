const Link = require("../models/Link");
const Visit = require("../models/Visit");
const bcrypt = require("bcryptjs");
// const useragent = require("useragent");
const axios = require("axios");
const UAParser = require("ua-parser-js");
// const axios = require("axios");
// const bcrypt = require("bcryptjs");
// const Link = require("../models/Link");
// const Visit = require("../models/Visit");

exports.redirectLink = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;

    const link = await Link.findOne({
      $or: [{ shortId: shortCode }, { customAlias: shortCode }],
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // ✅ Check expiration
    if (link.expirationDate && new Date() > link.expirationDate) {
      return res.status(410).json({ message: "Link has expired" });
    }

    // ✅ Check password protection
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

    // ✅ Extract analytics info
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    const parser = new UAParser(req.headers["user-agent"]);
    const deviceType = parser.getDevice().type || "desktop";
    const os = parser.getOS().name;
    const browser = parser.getBrowser().name;
    const browserVersion = parser.getBrowser().version;
    const referrer = req.get("referer") || "direct";

    let location = { country: "Unknown", region: "Unknown", city: "Unknown" };

    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
      if (geoRes.data.status === "success") {
        location = {
          country: geoRes.data.country,
          region: geoRes.data.regionName,
          city: geoRes.data.city,
          isp: geoRes.data.isp,
          lat: geoRes.data.lat,
          lon: geoRes.data.lon,
        };
      }
    } catch (err) {
      console.log("🌍 Location lookup failed:", err.message);
    }

    // ✅ Check if unique visitor
    const existingVisit = await Visit.findOne({ link: link._id, ip, browser });
    const isUnique = !existingVisit;

    // ✅ Save visit
    await Visit.create({
      link: link._id,
      ip,
      deviceType,
      browser,
      browserVersion,
      os,
      referrer,
      location,
      isUnique,
    });

    // ✅ Increment click count
    link.clickCount = (link.clickCount || 0) + 1;
    await link.save();

    // ✅ Redirect to original URL
    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
