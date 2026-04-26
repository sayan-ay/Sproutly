const Notification = require("../Models/notification");
const auth = require("../Middlewares/auth");

module.exports.notificationsAllGetter = async (req, res) => {
  if (req.user._id.toString() !== req.params.userid) {
    return res.status(403).json({ error: "Unauthorised" });
  }
  try {
    const notifs = await Notification.find({ reciever: req.user._id })
      .populate({
        path: "sender",
        select: "-email -password -bio -fullname",
      })
      .select(" -reciever ")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ notifs });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports.notificationsMarkRead = async (req, res) => {
  if (req.user._id.toString() !== req.params.userid) {
    return res.status(401).json({ error: "Invalid Request" });
  }
  try {
    const notifId = req.params.notifId;
    const notif = await Notification.findById(notifId).select("reciever");
    if (req.user._id.toString() !== notif.reciever.toString()) {
      return res.status(403).json({ error: "Unauthorised" });
    }
    await Notification.findByIdAndUpdate(notifId, { isRead: true });
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.json({ error: e.message });
  }
};
