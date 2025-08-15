const Visit = require("../models/Visit");
const Link = require("../models/Link");

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Make sure the link exists and belongs to the requesting user
    const link = await Link.findById(id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Get all visits for this link
    const visits = await Visit.find({ link: id });

    // 1. Total clicks
    const totalClicks = visits.length;

    // 2. Unique IP count
    const uniqueIPs = new Set(visits.map((v) => v.ip)).size;

    // 3. Device breakdown
    const deviceBreakdown = visits.reduce((acc, v) => {
      const device = v.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // 4. Browser breakdown
    const browserBreakdown = visits.reduce((acc, v) => {
      const browser = v.browser || "Unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    // 5. Location data
    const locationData = visits.reduce((acc, v) => {
      const location = `${v.location.country || "Unknown"} - ${
        v.location.city || "Unknown"
      }`;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    res.json({
      linkId: id,
      totalClicks,
      uniqueIPs,
      deviceBreakdown,
      browserBreakdown,
      locationData,
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
