const Visitor = require("../../models/Visitor");
const crypto = require("crypto");

// ✅ Single source of truth
const getVisitorId = (req) => {
  let visitorId = req.cookies?.visitorId;

  if (!visitorId) {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const raw = ip + req.headers["user-agent"];
    visitorId = crypto.createHash("sha256").update(raw).digest("hex");
  }

  return visitorId;
};

exports.trackVisitor = async (req, res) => {
  try {
    let visitorId = req.cookies?.visitorId;

    // ✅ If no cookie → generate + set cookie
    if (!visitorId) {
      visitorId = getVisitorId(req);

      res.cookie("visitorId", visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None", // for cross-domain
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    // ✅ Track once per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exists = await Visitor.findOne({
      visitorId,
      createdAt: { $gte: today },
    });

    if (!exists) {
      await Visitor.create({ visitorId });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Visitor.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = await Visitor.countDocuments({
      createdAt: { $gte: today },
    });

    res.json({ total, todayVisitors });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};