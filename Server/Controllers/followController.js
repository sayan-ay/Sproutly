const Follow = require("../Models/follow");
const Notification = require("../Models/notification");
const { emitToOneUser } = require("../config/socket");

module.exports.followUser = async (req, res) => {
  const follower = req.user._id;
  const authorFollowed = req.params.userid;
  const isFollowing = await Follow.exists({ follower, authorFollowed });

  if (follower.toString() === authorFollowed)
    return res.status(400).json({ message: "Can not follow Yourself" });

  if (isFollowing) {
    try {
      await Follow.deleteOne({
        follower,
        authorFollowed,
      });
      return res.status(200).json({ message: "unfollowed successfully" });
    } catch (err) {
      return res.json({ error: err });
    }
  } else {
    try {
      await Follow.create({
        follower,
        authorFollowed,
      });

      const notif = await Notification.create({
        notifType: "FOLLOW",
        sender: follower,
        reciever: authorFollowed,
        targetId: follower,
        targetType: "Follow",
      });

      const payload = await Notification.findById(notif._id)
        .populate({
          path: "sender",
          select: "-email -password -bio -fullname",
        })
        .select(" -reciever ")
        .lean();

      emitToOneUser(authorFollowed, "notification-add", payload);

      return res.status(200).json({ message: "followed successfully" });
    } catch (err) {
      return res.json({ error: err });
    }
  }
};
